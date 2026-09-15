import { facts } from './assistant-data.js';
let extractor, embeddings, boot;
async function prepare(){
 if(boot)return boot;
 boot=(async()=>{
  const {pipeline,env}=await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js');
  env.allowLocalModels=false;
  env.backends.onnx.wasm.numThreads=1;
  env.backends.onnx.wasm.proxy=false;
  extractor=await pipeline('feature-extraction','Xenova/all-MiniLM-L6-v2',{quantized:true});
  const result=await extractor(facts.map(f=>f.question+" "+f.answer),{pooling:'mean',normalize:true});
  embeddings=result.tolist();
 })();
 return boot;
}
self.onmessage=async({data})=>{
 try{
  await prepare();
  if(data.type==='init'){self.postMessage({type:'ready'});return;}
  const vector=(await extractor(data.question,{pooling:'mean',normalize:true})).tolist()[0];
  const scores=embeddings.map((v,i)=>({index:i,score:v.reduce((sum,n,j)=>sum+n*vector[j],0)})).sort((a,b)=>b.score-a.score);
  const best=scores[0];
  // Low confidence questions are sent to Jade instead of guessed at.
  const id=best.score>=.35 && best.score-scores[1].score>=.025 ? facts[best.index].id : null;
  self.postMessage({type:'answer',requestId:data.requestId,id});
 }catch(error){self.postMessage({type:'error',requestId:data.requestId,message:'AI matching could not load.'});}
};
