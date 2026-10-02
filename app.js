const app=document.getElementById("app");
const USERS_KEY="sdm_users";
const SESSION_KEY="sdm_session";

const getUsers=()=>JSON.parse(localStorage.getItem(USERS_KEY)||"[]");
const saveUsers=(users)=>localStorage.setItem(USERS_KEY,JSON.stringify(users));
const getSession=()=>localStorage.getItem(SESSION_KEY);

function auth(mode="login"){
  const signup=mode==="signup";
  app.innerHTML=`
    <section class="screen">
      <div class="auth">
        <div class="brand">Seleção dos Mídia</div>
        <h1>${signup?"Criar conta":"Entrar"}</h1>
        <p class="sub">${signup?"Crie sua conta para continuar.":"Entre para acessar sua área."}</p>
        <form class="form" id="authForm">
          ${signup?'<input class="field" id="name" type="text" placeholder="Nome" autocomplete="name" required />':""}
          <input class="field" id="email" type="email" placeholder="E-mail" autocomplete="email" required />
          <input class="field" id="password" type="password" placeholder="Senha" autocomplete="${signup?"new-password":"current-password"}" minlength="6" required />
          <div class="error" id="error"></div>
          <button class="primary" type="submit">${signup?"Criar conta":"Continuar"}</button>
        </form>
        <button class="switch" id="switch">${signup?"Já tenho uma conta":"Não tenho uma conta"} <span>${signup?"Entrar":"Cadastrar"}</span></button>
      </div>
    </section>`;
  document.getElementById("switch").onclick=()=>auth(signup?"login":"signup");
  document.getElementById("authForm").onsubmit=(e)=>{
    e.preventDefault();
    const email=document.getElementById("email").value.trim().toLowerCase();
    const password=document.getElementById("password").value;
    const error=document.getElementById("error");
    const users=getUsers();
    if(signup){
      const name=document.getElementById("name").value.trim();
      if(users.some(u=>u.email===email)){error.textContent="Este e-mail já está cadastrado.";return}
      users.push({id:crypto.randomUUID(),name,email,password});
      saveUsers(users);
      localStorage.setItem(SESSION_KEY,email);
      home(name);
    }else{
      const user=users.find(u=>u.email===email&&u.password===password);
      if(!user){error.textContent="E-mail ou senha incorretos.";return}
      localStorage.setItem(SESSION_KEY,user.email);
      home(user.name);
    }
  };
}

function home(name){
  app.innerHTML=`
    <section class="home">
      <header class="top">
        <div class="hello">Olá, ${escapeHtml(name)}</div>
        <button class="logout" id="logout">Sair</button>
      </header>
      <div class="hero">
        <h1>home</h1>
        <p>Você está conectado.</p>
      </div>
    </section>`;
  document.getElementById("logout").onclick=()=>{localStorage.removeItem(SESSION_KEY);auth()};
}

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

const session=getSession();
if(session){
  const user=getUsers().find(u=>u.email===session);
  user?home(user.name):auth();
}else auth();