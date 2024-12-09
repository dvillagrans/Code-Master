import json

def sum_of_list(elements):
    return sum(elements)

# Caso de prueba
input_data = "[1, 2, 3, 4]"  # Simula la entrada como JSON
parsed_input = json.loads(input_data)  # Convierte a lista de Python
print(sum_of_list(parsed_input))  # Salida: 10
