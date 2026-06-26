export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'POST only'});
  try{
    const {user_prompt,category}=req.body;
    const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Authorization':`Bearer ${process.env.GROQ_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'llama3-70b-8192',
        messages:[
          {role:'system',content:`Expand into detailed fashion runway video prompt. Category:${category}`},
          {role:'user',content:user_prompt}
        ],
        temperature:0.8
      })
    });
    const d=await r.json();
    res.json({enhanced_prompt:d.choices[0].message.content});
  }catch(e){res.status(500).json({error:e.message});}
}
