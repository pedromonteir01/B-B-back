const verifyEmail = (email) => {
    return email.includes("@");
}

const verifyCpf = (cpf) => {
    var numeros, digitos, soma, i, resultado, digitos_iguais;
    digitos_iguais = 1;
    if (cpf.length < 11)
        return false;
    for (i = 0; i < cpf.length - 1; i++)
        if (cpf.charAt(i) != cpf.charAt(i + 1)) {
            digitos_iguais = 0;
            break;
        }
    if (!digitos_iguais) {
        numeros = cpf.substring(0, 9);
        digitos = cpf.substring(9);
        soma = 0;
        for (i = 10; i > 1; i--)
            soma += numeros.charAt(10 - i) * i;
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
            return false;
        numeros = cpf.substring(0, 10);
        soma = 0;
        for (i = 11; i > 1; i--)
            soma += numeros.charAt(11 - i) * i;
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
            return false;
        return true;
    }
    else
        return false;
}

const number = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const specialCaracteres = ['!', '@', '#', '$', '%', '&', '*', '(', ')', '£', '¢', '¬', '§', '-', '_', '+', '=', '[', ']', '{', '}', '^', '~', ':', ';', '/'];

const verifyPassword = (password) => {
    if(password.length < 9) {
        return false;
    }
    let containsNumber = false;
    for (let i = 0; i < number.length; i++) {
        if (password.includes(number[i])) {
            containsNumber = true;
            break;
        }
    }
    if (!containsNumber) {
        return false;
    }
    let containsSpecialCharacter = false;
    for (let i = 0; i < specialCaracteres.length; i++) {
        if (password.includes(specialCaracteres[i])) {
            containsSpecialCharacter = true;
            break;
        }
    }
    if (!containsSpecialCharacter) {
        return false;
    }
    return true;
}


module.exports = { verifyEmail, verifyCpf, verifyPassword };