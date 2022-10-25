from tkinter import *
from tkinter.filedialog import Tk
from tkinter.filedialog import Text
from tkinter.filedialog import asksaveasfile
from tkinter.filedialog import askopenfile
from tkinter.messagebox import *
 
filename = NONE
 
def newFile():
    global filename
    filename = "Untitled"
    Text.delete(0.0, END)
 
def saveFile():
    global  filename
    t = Text.get(0.0, END)
    f = open(filename, 'w')
    f.write(t)
    f.close()
 
def saveAs():
    f = asksaveasfile(mode='w', defaultextension='.txt')
    t = Text.get(0.0, END)
    try:
        f.write(t.rstrip())
    except:
        showerror(title="Oops!", message="Unable to save file....")
 
def openFile():
    f = askopenfile(mode="r")
    t = f.read()
    Text.delete(0.0, END)
    Text.insert(0.0, t)
 
root = Tk()
root.title("JPad v0.1b")
root.minsize(width=400, height=400)
root.maxsize(width=400, height=400)
 
text = Text(root, width=400, height=400)
text.pack()
 
menuBar = Menu(root)
fileMenu = Menu(menuBar)
fileMenu.add_command(label="New", command=newFile())
fileMenu.add_command(label="Open", command=openFile())
fileMenu.add_command(label="Save", command=saveFile())
fileMenu.add_command(label="Save As", command=saveAs())
fileMenu.add_separator()
fileMenu.add_command(label="Exit", command=root.quit())
menuBar.add_cascade(label="File", menu=fileMenu)
 
root.config(menu=menuBar)
root.mainloop()