import json
import flask
from flask import Flask
from flask import request, jsonify
import matplotlib
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.collections import PatchCollection
import os
import math
matplotlib.use('Agg')
import numpy as np
from io import StringIO, BytesIO

def validador(d, shaft_len):
    #Validação dos inputs
    valido = True
    if(d > (shaft_len/2)-0.1):
        valido = False
        print("\x1b[31m\"O valor de 'd' não pode ser maior que a metade do tamanho do eixo\"\x1b[0m")
    return valido

def dimensionamentoEixo(Sn, n, Mt, de, Mf):
    return pow(((32*n)/np.pi)*pow(((Mt/de)**2+(Mf/Sn)**2), 1/2), 1/3)

def calculakb(d):
    if d <= 0.01:
        return 1
    elif d >= 0.01 and d <=0.05:
        return 0.9
    else: 
        return 1 - ((d-0.03)/15)
    
def calculaSn(ka, kb, kc, kd, ke, kf, kg, Sf):
    return ka*kb*kc*kd*ke*kf*kg*Sf

def calculoreac(A, d, i, torque, peso_conjunto):
    Mt = i * torque
    f1 = peso_conjunto/2
    f2 = f1
    
    r2 = (f1*d + f2*(A + d)/(2*d+A))
    r1 = peso_conjunto - r2
          
    momento_fletor_max = r1 * d
    momento_torcor = torque * i
          
    return f1, f2, r1, r2, momento_fletor_max, momento_torcor

def plot_shaft(d, shaft_len, f1, f2, r1, r2, m1):
    plt.clf() 
    plt.title('Diagrama de forças')
    margin = (shaft_len + 1)/7
    plt.axis([-margin, shaft_len+ margin, -2, 2])

    # eixo
    plt.plot([0, shaft_len],[0,0], 'k')
    # apoios
    plt.plot([0, shaft_len],[-0.2,-0.2], 'b', marker='^', ls='', ms=15)

    # Forças
    plt.arrow(0 + d, 1, 0, -0.8, head_width=(shaft_len + 1)/25, head_length=0.2, fc='k', ec='k', width=0.02)
    plt.arrow(shaft_len - d, 1, 0, -0.8, head_width=(shaft_len + 1)/25, head_length=0.2, fc='k', ec='k', width=0.02)


    # distancias 
    plt.plot([0, d],[-1,-1], 'k', marker='|', ls='--', ms=15)
    plt.plot([d, shaft_len - d],[-1,-1], 'k', marker='|', ls='--', ms=15)
    plt.plot([shaft_len - d, shaft_len],[-1,-1], 'k', marker='|', ls='--', ms=15)

    # Marcações
    plt.text(d/2,-1.5, 'd', fontdict=None, ha="center")
    plt.text(shaft_len - d/2,-1.5, 'd', fontdict=None, ha="center")
    plt.text(shaft_len/2,-1.5, 'A', fontdict=None, ha="center")

    plt.text(d,1.2, f'{f1} N', fontdict=None, ha="center")
    plt.text(shaft_len - d,1.2, f'{f2} N', fontdict=None, ha="center")

    plt.text(0,-0.7, f'{r1} N', fontdict=None, ha="center")
    plt.text(shaft_len,-0.7,f'{r2} N', fontdict=None, ha="center")

    plt.text(shaft_len/2, 0.3, f'{m1} N.m', fontdict=None, ha="center")

    # Dados

    dados = f'Dados:\n d = {d}\n A = {shaft_len- 2*d}\n F1 = {0} \n F2 = {0} \n '

    # plt.text(0,-5, dados, fontdict=None, )
    plt.gca().get_yaxis().set_visible(False)
    ax = plt.subplot()
    # ax.spines.set_visible(False)

    for key, spine in ax.spines.items():
        spine.set_visible(False)
    ax.spines["bottom"].set_visible(True)


    ax.plot([shaft_len/2],[0], 'r', marker=r'$\circlearrowright$',ms=20)
    plot_bytes = BytesIO()
    plt.savefig(plot_bytes, format = "png", transparent=True)
    plot_bytes.seek(0)

    return plot_bytes

def plot_diagrama_forca_cortante(fc, shaft_len, d):
    
    plt.title('Diagrama força cortante')
    marginx = (shaft_len + 1)/7
    marginy = (abs(fc) + 1)/7

    plt.axis([-marginx, shaft_len+ marginx,  fc - marginy if fc < 0 else marginy, fc + marginy if fc > 0 else marginy])

    # eixo
    plt.step([0,0, d, shaft_len - d, shaft_len,0],[0,fc,fc,0,fc,0])
    plt.plot([0, shaft_len],[0,0], 'k', ls="--")
    # plt.plot([0, d, shaft_len - d, shaft_len],[fc,0,0,fc], 'b', )

    ax = plt.subplot()
    # ax.spines.set_visible(False)

    for key, spine in ax.spines.items():
        spine.set_visible(False)
    ax.spines["bottom"].set_visible(True)
    ax.spines["left"].set_visible(True)

    plot_bytes = BytesIO()
    plt.savefig(plot_bytes, format = "png")
    plot_bytes.seek(0)

    return plot_bytes

def plot_momento_fletor(M, shaft_len, fc, d):
    plt.title('Diagrama Momento Fletor')
    marginx = (shaft_len + 1)/7
    marginy = (abs(fc) + 1)/7

    plt.axis([-marginx, shaft_len+ marginx,  fc - marginy if fc < 0 else marginy, fc + marginy if fc > 0 else marginy])

    # eixo
    plt.plot([0, d, shaft_len - d, shaft_len],[0,M,M,0])
    plt.plot([0, shaft_len],[0,0], 'k', ls="--")
    # plt.plot([0, d, shaft_len - d, shaft_len],[fc,0,0,fc], 'b', )

    ax = plt.subplot()
    # ax.spines.set_visible(False)

    for key, spine in ax.spines.items():
        spine.set_visible(False)
    ax.spines["bottom"].set_visible(True)
    ax.spines["left"].set_visible(True)
    
    plot_bytes = BytesIO()
    plt.savefig(plot_bytes, format = "png")
    plot_bytes.seek(0)

    return plot_bytes

def plot_momento_torcor(shaft_len, T, fc):
    plt.title('Diagrama Momento Torçor')
    marginx = (shaft_len + 1)/7
    marginy = (abs(fc) + 1)/7

    plt.axis([-marginx, shaft_len+ marginx,  fc - marginy if fc < 0 else marginy, fc + marginy if fc > 0 else marginy])

    # eixo
    plt.plot([0, 0, shaft_len, shaft_len],[0,T,T,0])
    plt.plot([0, shaft_len],[0,0], 'k', ls="--")
    # plt.plot([0, d, shaft_len - d, shaft_len],[fc,0,0,fc], 'b', )

    ax = plt.subplot()

    for key, spine in ax.spines.items():
        spine.set_visible(False)
    ax.spines["bottom"].set_visible(True)
    ax.spines["left"].set_visible(True)
    
    plot_bytes = BytesIO()
    plt.savefig(plot_bytes, format = "png")
    plot_bytes.seek(0)

    return plot_bytes
    # ax.spines.set_visible(False)
