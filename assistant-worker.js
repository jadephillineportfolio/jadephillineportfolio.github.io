import { facts } from './assistant-data.js?rev=20260915-2';
let extractor, embeddings, boot;
const examples={
 services:['What is your area of expertise?','Can you shape my raw footage into a story?','What kind of creative work can you do?'],
 watch:['I would like to see examples of your work.','Where should I begin exploring your films?'],
 book:['I want to talk to the person behind this portfolio.','How can we begin working together?'],
 price:['What budget should I set aside for this project?'],
 availability:['How soon could you finish a project?'],
 location:['Which city do you live in?'],
 tools:['Which applications are part of your creative workflow?'],
 experience:['Tell me about your professional background.']
};
const intents=facts.flatMap(f=>[f.question,...(examples[f.id]||[])].map(text=>({id:f.id,text})));
async function prepare(){
 if(boot)return boot;
 boot=(async()=>{
  const {pipeline,env}=await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js');
  env.allowLocalModels=false;
  env.backends.onnx.wasm.numThreads=1;
  env.backends.onnx.wasm.proxy=false;
  extractor=await pipeline('feature-extraction','Xenova/all-MiniLM-L6-v2',{quantized:true});
  // Compare intent with intent; long answer paragraphs can skew short questions.
  const result=await extractor(intents.map(intent=>intent.text),{pooling:'mean',normalize:true});
  embeddings=result.tolist();
 })();
 return boot;
}
self.onmessage=async({data})=>{
 try{
  await prepare();
  if(data.type==='init'){self.postMessage({type:'ready'});return;}
  const vector=(await extractor(data.question,{pooling:'mean',normalize:true})).tolist()[0];
  const similarities=embeddings.map(v=>v.reduce((sum,n,j)=>sum+n*vector[j],0));
  const scores=facts.map(f=>({id:f.id,score:Math.max(...intents.flatMap((intent,i)=>intent.id===f.id?[similarities[i]]:[]))})).sort((a,b)=>b.score-a.score);
  const best=scores[0];
  // Low confidence questions are sent to Jade instead of guessed at.
  const id=best.score>=.35 && best.score-scores[1].score>=.025 ? best.id : null;
  self.postMessage({type:'answer',requestId:data.requestId,id});
 }catch(error){self.postMessage({type:'error',requestId:data.requestId,message:'AI matching could not load.'});}
};
