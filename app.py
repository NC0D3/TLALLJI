'''
    Raspberry Pi GPIO Status and Control
'''
#se importan todas las librerias necesarias
from flask import Flask, render_template, request
import requests, json
import datetime

#se inicializan todas las variables necesarias
datastr = ' '
now = datetime.datetime.now()
fechastr = now.strftime("%Y-%m-%d %H:%M:%S");
#se crean todas las funciones necesarias
def read_data():
    with open('data.txt', 'r') as reader:
        mode = reader.readline().replace('\n', '')
        E = reader.readline().replace('\n', '')
        R = reader.readline().replace('\n', '')
        method = reader.readline().replace('\n', '')
        return mode+'@'+E+'@'+R+'@'+method
    
def write_data(line,value):
    with open('data.txt', 'r') as file:
        lines = file.readlines()
    if len(lines) > int(line):
        lines[line] = value
    with open('data.txt', 'w') as file:
        file.writelines(lines)
#se crea la entidad de la aplicacion en flask
app = Flask(__name__)

@app.route("/",methods=['GET', 'POST'])
def index():
    if request.method == "POST":
        if 'type' in request.form:
            tipo = request.form["type"]
            if tipo == "open":
                return read_data()
            elif tipo == "refresh":
                return read_data()
            elif tipo=="settings":
                print(request.form)
                E = request.form["E"]
                print(E)
                write_data(1,E+'\n')
                return read_data()
            elif tipo=="change":
                cart = request.form["var"]
                write_data(0,cart+'\n')
    return render_template("Lokalization.html")#return render_template("index.html", **templateData)

if __name__ == "__main__":
   app.run(host='0.0.0.0', port=80, debug=True)

   
   