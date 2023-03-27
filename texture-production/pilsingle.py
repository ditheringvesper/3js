# from PIL import Image
# for i in range(0, 1000)
# 	image_file = Image.open("Eye"+i+".jpg") 
# 	image_file = image_file.convert('1') # convert
# 	image_file.save('ey'+i+".jpg')

from PIL import Image
def main():
	inim = str(input("What file do you want to convert, Vesper?: "))
	outim = str(input("What do you want to call the new file, Vesper?: "))
	image_file = Image.open(inim)
	image_file = image_file.convert('1')
	image_file.save(outim)
	
main();