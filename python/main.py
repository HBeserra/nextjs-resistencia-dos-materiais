import json
from flask import Flask
from flask import request, jsonify, render_template, send_file
from flask_cors import CORS
import matplotlib
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.collections import PatchCollection
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
matplotlib.use('Agg')
import numpy as np
from io import StringIO, BytesIO
import funcs

#PODE COMENTAR ESSA LINHA
#from flask_ngrok import run_with_ngrok

matplotlib.rcParams["figure.dpi"] = 200
app = Flask(__name__)
CORS(app)

#ESSA AQUI EMBAIXO TAMBÉM
#run_with_ngrok(app)

@app.route("/", methods = ['GET, POST'])
def hello():
    return "Oi, eu funciono."

@app.route("/calc_dim", methods = ['POST'])
def calc_dim():
    if request.method == 'POST':
        shaft_len = float(request.form.get('shaft_len'))
        d = float(request.form.get('d'))

        optional_entry = int(request.form.get('optional_entries'))
        valido = funcs.validador(d, shaft_len)

        if valido:

            n = float(request.form.get('coeficiente_seguranca'))
            torque = float(request.form.get('torque'))
            peso_conjunto = float(request.form.get('peso_conjunto'))
            coef_transmissao = float(request.form.get('coef_transmissao'))
            d_entre_rodas = float(request.form.get('d_entre_rodas'))

            if optional_entry == 1:
                f1, f2, r1, r2, momento_fletor_max, momento_torcor = funcs.calculoreac(d_entre_rodas, d, coef_transmissao, torque, peso_conjunto)
                
                ka = float(request.form.get('corr_acabamento_superficial'))
                kb = float(request.form.get('corr_tam_peca'))
                kc = float(request.form.get('fator_confiabilidade'))
                kd = float(request.form.get('temp_corr'))
                ke = float(request.form.get('servicos_pesados'))
                kf = float(request.form.get('corr_tensao_concentrados'))
                kg = float(request.form.get('corr_incertezas'))
                Sf = float(request.form.get('lim_resist_fadiga'))

                Sn = funcs.calculaSn(ka, kb, kc, kd, ke, kf, kg, Sf)
                dim_eixo = funcs.dimensionamentoEixo(Sn, n, momento_torcor, Sf, momento_fletor_max)

                response = jsonify(shaft_len = shaft_len, d = d, dim_eixo = dim_eixo, momento_torcor = momento_torcor, 
                                momento_fletor_max = momento_fletor_max, f1 = f1, f2 = f2, r1 = r1, r2 = r2)
                response.headers.add('Access-Control-Allow-Origin', '*')
                return response
            else:
                ka = 0.8
                kb = 0.9
                kc = 0.897
                kd = 1.0
                ke = 1.0
                kf = 0.63
                kg = 1.0
                Sf = (180*pow(10,6))
                if not kb:
                    kb = funcs.calculakb(d)
                f1, f2, r1, r2, momento_fletor_max, momento_torcor = funcs.calculoreac(d_entre_rodas, d, coef_transmissao, torque, peso_conjunto)
                Sn = funcs.calculaSn(ka, kb, kc, kd, ke, kf, kg, Sf)
                Sn = 73.14*pow(10,6)
                dim_eixo = funcs.dimensionamentoEixo(Sn, n, momento_torcor, Sf, momento_fletor_max)

                response = jsonify(shaft_len = shaft_len, d = d, dim_eixo = dim_eixo, momento_torcor = momento_torcor, 
                                momento_fletor_max = momento_fletor_max, f1 = f1, f2 = f2, r1 = r1, r2 = r2)
                response.headers.add('Access-Control-Allow-Origin', '*')
                return response
  
        else:
            return "ERROR ON CALCULUS"

@app.route("/shaft_plot", methods = ['POST'])
def shaft_plot_req():
    shaft_len = float(request.form.get('shaft_len'))
    d = float(request.form.get('d'))
    f1 = float(request.form.get('f1'))
    f2 = float(request.form.get('f2'))
    r1 = float(request.form.get('r1'))
    r2 = float(request.form.get('r2'))
    momento_torcor = float(request.form.get('momento_torcor'))
    shaft_plot = funcs.plot_shaft(d, shaft_len, f1, f2, r1, r2, momento_torcor)

    return send_file(shaft_plot, mimetype='image/png')

@app.route("/cortante_plot", methods = ['POST'])
def cortante_plot_req():
    shaft_len = float(request.form.get('shaft_len'))
    f1 = float(request.form.get('f1'))
    cortante_plot = funcs.plot_diagrama_forca_cortante(f1, shaft_len)

    return send_file(cortante_plot, mimetype='image/png')

@app.route("/torcor_plot", methods = ['POST'])
def torcor_plot_req():
    f1 = float(request.form.get('f1'))
    shaft_len = float(request.form.get('shaft_len'))
    momento_torcor = float(request.form.get('momento_torcor'))
    print(momento_torcor, shaft_len, f1)
    torcor_plot = funcs.plot_momento_torcor(shaft_len, momento_torcor, f1)

    return send_file(torcor_plot, mimetype='image/png')

@app.route("/momento_fletor_plot", methods = ['POST'])
def fletor_plot_req():
    f1 = float(request.form.get('f1'))
    shaft_len = float(request.form.get('shaft_len'))
    d = float(request.form.get('d'))
    momento_fletor = float(request.form.get('momento_fletor'))
    momento_fletor_plot = funcs.plot_momento_fletor(momento_fletor, shaft_len, f1, d)

    return send_file(momento_fletor_plot, mimetype='image/png')


if __name__ == "__main__":
    app.run(debug = False) #SE QUISER PODE USAR NESSE MODO AQ SE N FOR USAR NGROK
    #app.run() 
