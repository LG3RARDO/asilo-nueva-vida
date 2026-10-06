from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)

# Simulación de notificaciones enviadas (base de datos en memoria)
notificaciones = []

@app.route('/notificaciones/enviar', methods=['POST'])
def enviar_notificacion():
    datos = request.get_json()

    # Validar datos obligatorios
    if not datos or 'familiar' not in datos or 'paciente' not in datos:
        return jsonify({
            'error': 'Faltan datos obligatorios: familiar y paciente'
        }), 400

    # Crear la notificación
    notificacion = {
        'id': len(notificaciones) + 1,
        'familiar': datos['familiar'],
        'correo': datos.get('correo', 'sin-correo@asilo.com'),
        'paciente': datos['paciente'],
        'mensaje': f"Se ha creado una solicitud médica para {datos['paciente']}. "
                   f"El asilo Nueva Vida le informa que su familiar "
                   f"será atendido próximamente.",
        'estado': 'enviada',
        'fecha': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }

    notificaciones.append(notificacion)

    return jsonify({
        'mensaje': 'Notificacion enviada exitosamente',
        'notificacion': notificacion
    }), 201

@app.route('/notificaciones', methods=['GET'])
def listar_notificaciones():
    return jsonify({
        'total': len(notificaciones),
        'notificaciones': notificaciones
    }), 200

@app.route('/notificaciones/<int:id>', methods=['GET'])
def obtener_notificacion(id):
    notif = next((n for n in notificaciones if n['id'] == id), None)
    if not notif:
        return jsonify({'error': 'Notificacion no encontrada'}), 404
    return jsonify(notif), 200

@app.route('/notificaciones/estado/<int:id>', methods=['PUT'])
def actualizar_estado(id):
    notif = next((n for n in notificaciones if n['id'] == id), None)
    if not notif:
        return jsonify({'error': 'Notificacion no encontrada'}), 404

    datos = request.get_json()
    notif['estado'] = datos.get('estado', notif['estado'])

    return jsonify({
        'mensaje': 'Estado actualizado',
        'notificacion': notif
    }), 200

if __name__ == '__main__':
    print("Microservicio de Notificaciones corriendo en puerto 5001")
    app.run(host='0.0.0.0', port=5001, debug=True)