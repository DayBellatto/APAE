function validacao(){
   const email= document.getElementById("mail").value;
   if(!email){
    document.getElementById('recover-password-button').disable = true;
   }else if (validaEmail(email)){
    document.getElementById('recover-password-button').disable = false;
   }
   else{
    document.getElementById('recover-password-button').disable = true;
   }
}

function isEmailValid(){
    
}

function validaEmail(email){
    return /\S+@\S+\.\S+/.test(email);
}


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // impede o envio padrão (POST)

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("password").value.trim();

    if (!email || !senha) {
      alert("Preencha todos os campos.");
      return;
    }

    if (validaEmail(email)) {
      // simulação de login válido
      window.location.href = "../Principal/test.html";
    } else {
      alert("Email inválido.");
    }
  });
});
