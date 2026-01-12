

const authcheck = async() =>{
    try{
        await checkauth();
        window.location.href = "/dashboard.html";
    }catch(err){
        console.log("Not authenticated:", err);
    }
}


const form = document.getElementById("login-form");

if(form){

form.addEventListener("submit", async(e)=>{
    e.preventDefault();

    const email =  form.email.value;
    const password = form.password.value;
    try{
        const res = await loginuser({email, password});
        const verified = await checkauth();
        window.location.href = `/dashboard.html`;
    }catch(err){
        alert(err.message);
        console.log("Login error:", err);
    }
    }
);
}

const formRegister = document.getElementById("register-form");

if(formRegister){

formRegister.addEventListener("submit", async(e)=>{
    e.preventDefault();

    const email =  formRegister.email.value;
    const password = formRegister.password.value;

    try{
        const res = await registeruser({email, password});
        console.log("Registration successful:", res);
        const verified = await checkauth();
        window.location.href = `/dashboard.html`;   
    }
    catch(err){
        alert(err.message);
        console.log("Registration error:", err);
    }
});
}



