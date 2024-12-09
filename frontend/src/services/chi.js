function toBase64Unicode(str) {
    return Buffer.from(str, 'utf-8').toString('base64');
}

const solutionCode = `
def linear_regression(*points):
    """
    Calcula los parámetros de la recta de regresión lineal (y = mx + b)
    :param points: Tuplas de puntos (x, y) desempaquetadas
    :return: Tupla (m, b) donde m es la pendiente y b es la intersección
    """
    # Convertir puntos desempaquetados en una lista
    points = list(points)
    
    n = len(points)
    if n == 0:
        raise ValueError("La lista de puntos no puede estar vacía")
    
    sum_x = sum(point[0] for point in points)
    sum_y = sum(point[1] for point in points)
    sum_xx = sum(point[0]**2 for point in points)
    sum_xy = sum(point[0] * point[1] for point in points)
    
    m = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x**2)
    b = (sum_y - m * sum_x) / n
    
    return round(m, 2), round(b, 2)
`;

const encodedCode = toBase64Unicode(solutionCode);

// Imprime el código original
console.log("Original Code:", solutionCode);

// Codifica el código en Base64
console.log("Encoded Code (Base64):", encodedCode);

// Crea el payload con el código codificado
const payload = {
    problem_id: 4, // ID del problema
    language: "python", // Lenguaje seleccionado
    code: encodedCode, // Código en formato Base64
};

async function submitSolution() {
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
}