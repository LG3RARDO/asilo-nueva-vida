from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)

# Base de datos simulada de pacientes
pacientes = [
    {
        'id': 1,
        'codigo': 'PAC-001',
        'nombre': 'Juan Carlos Pérez',
        'fecha_ingreso': '2024-01-15',
        'estado': 'activo',
        'especialidad': 'Cardiología',
        'saldo_pendiente': 450.00
    },
    {
        'id': 2,
        'codigo': 'PAC-002',
        'nombre': 'María Elena López',
        'fecha_ingreso': '2024-03-20',
        'estado': 'activo',
        'especialidad': 'Neurología',
        'saldo_pendiente': 0.00
    },
    {
        'id': 3,
        'codigo': 'PAC-003',
        'nombre': 'Roberto Gómez',
        'fecha_ingreso': '2023-11-10',
        'estado': 'inactivo',
        'especialidad': 'Traumatología',
        'saldo_pendiente': 200.00
    },
    {
        'id': 4,
        'codigo': 'PAC-004',
        'nombre': 'Ana Lucía Martínez',
        'fecha_ingreso': '2025-01-05',
        'estado': 'activo',
        'especialidad': 'Cardiología',
        'saldo_pendiente': 750.00
    },
]

@app.route('/reportes/pacientes', methods=['GET'])
def reporte_todos():
    estado = request.args.get('estado')

    if estado:
        resultado = [p for p in pacientes if p['estado'] == estado]
    else:
        resultado = pacientes

    return jsonify({
        'reporte': 'Reporte de Pacientes — Asilo Nueva Vida',
        'fecha_generacion': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'total': len(resultado),
        'pacientes': resultado
    }), 200

@app.route('/reportes/saldos', methods=['GET'])
def reporte_saldos():
    con_deuda = [p for p in pacientes if p['saldo_pendiente'] > 0]
    total_deuda = sum(p['saldo_pendiente'] for p in con_deuda)

    return jsonify({
        'reporte': 'Reporte de Saldos Pendientes — Asilo Nueva Vida',
        'fecha_generacion': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'total_pacientes_con_deuda': len(con_deuda),
        'total_deuda_general': total_deuda,
        'detalle': con_deuda
    }), 200

@app.route('/reportes/especialidades', methods=['GET'])
def reporte_especialidades():
    especialidades = {}
    for p in pacientes:
        esp = p['especialidad']
        if esp not in especialidades:
            especialidades[esp] = 0
        especialidades[esp] += 1

    return jsonify({
        'reporte': 'Reporte por Especialidad — Asilo Nueva Vida',
        'fecha_generacion': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'especialidades': especialidades
    }), 200

@app.route('/reportes/resumen', methods=['GET'])
def reporte_resumen():
    activos = len([p for p in pacientes if p['estado'] == 'activo'])
    inactivos = len([p for p in pacientes if p['estado'] == 'inactivo'])
    total_deuda = sum(p['saldo_pendiente'] for p in pacientes)

    return jsonify({
        'reporte': 'Resumen General — Asilo Nueva Vida',
        'fecha_generacion': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'total_pacientes': len(pacientes),
        'pacientes_activos': activos,
        'pacientes_inactivos': inactivos,
        'deuda_total': total_deuda
    }), 200

if __name__ == '__main__':
    print("Microservicio de Reportes corriendo en puerto 5002")
    app.run(host='0.0.0.0', port=5002, debug=True)