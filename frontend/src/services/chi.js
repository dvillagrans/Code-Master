function toBase64Unicode(str) {
    return Buffer.from(str, 'utf-8').toString('base64');
}

const solutionCode = `
# Leer dos números de la entrada
a, b = map(int, input().split())

# Calcular la suma
print(a + b)

`;

const encodedCode = toBase64Unicode(solutionCode);


// Imprime el código original
console.log("Original Code:", solutionCode);

// Codifica el código en Base64
console.log("Encoded Code (Base64):", encodedCode);

// Crea el payload con el código codificado
const payload = {
    problem_id: 2, // ID del problema
    language: "python", // Lenguaje seleccionado
    code: encodedCode, // Código en formato Base64
};

// Enviar la solicitud a la API
const response = await fetch("http://127.0.0.1:8000/solutions/submit/", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMzNzE2NjMyLCJpYXQiOjE3MzMxMTE4MzIsImp0aSI6IjJlY2FmYmVmZDcwOTQ4Y2M4ZTVjYmM2MGM1MmU0NWRmIiwidXNlcl9pZCI6Mn0.XNoE21RTOt8m3X8od2Fn_gzS6lkyYVrqa8T52qHwGRI",
    },
    body: JSON.stringify(payload),
});

// Convertir la respuesta a JSON
const data = await response.json();