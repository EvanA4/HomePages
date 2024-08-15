import mysql.connector
import sys
import datetime


def connectToDB():
  try:
    file = open('secret.txt')
  except:
    print("Error: failed to open 'secret.txt' (probably missing).")
    exit(1)
  secretTxt = file.read()
  search = secretTxt.find('\n')
  if search != -1:
    secretTxt = secretTxt[:search]

  try:
    output = mysql.connector.connect(
      host="127.0.0.1",
      database="Blogs",
      user="root",
      password=secretTxt
    )
  except:
    print("Error: failed to connect to MySQL. Invalid password?")
    exit(1)

  return output


def printUsage() -> None:
  print("Usage: python blogManager.py\n" +
        "-d             :             Delete a blog given its title.", file=sys.stderr)
  exit(1)


def parseArgs(args: list[str]) -> tuple:
  '''
  [0] Are we deleting a blog?
  '''
  output = [False]
  occurBools = [False]
  for i in range(1, len(args)):
    if args[i] == '-d':
      if occurBools[0]:
        printUsage()
      output[0] = True
      occurBools[0]
    else:
      printUsage()
  return tuple(output)


def deleteBlog(title: str, mycursor) -> None:
  '''
  Deletes a blog given it's title.
  '''
  # check if blog already exists
  # if there isn't one, throw an error
  sql = "SELECT * FROM BlogSnippets WHERE title = %s"
  val = (title, )
  mycursor.execute(sql, val)
  myresult = mycursor.fetchall()
  if len(myresult) == 0:
    print(f'Error: no blog found by the name "{title}".')
    exit(1)

  sql = "DELETE FROM FullBlogs WHERE title = %s"
  val = (title, )
  mycursor.execute(sql, val)

  sql = "DELETE FROM BlogSnippets WHERE title = %s"
  val = (title, )
  mycursor.execute(sql, val)


def createBlog(title: str, desc: str, content: str, mycursor) -> None:
  '''
  Creates a blog given its title, description, and content.
  '''
  # add the small description
  sql = "INSERT INTO BlogSnippets (title, summary) VALUES (%s, %s)"
  val = (title, desc)
  mycursor.execute(sql, val)

  # add the full blog
  sql = "INSERT INTO FullBlogs (title, content) VALUES (%s, %s)"
  val = (title, content)
  mycursor.execute(sql, val)


def readBlog() -> tuple[str]:
  '''
  [0] blog title
  [1] blog description
  [2] blog content
  '''
  file = open("blog.txt")
  lines = file.readlines()
  title = lines[1][:-1]
  desc = lines[4][:-1]
  content = ''
  for contentLine in lines[7:]:
    content += contentLine
  return (title, desc, content)

if __name__ == '__main__':
  toDelete = parseArgs(sys.argv)[0]
  title, desc, content = readBlog()

  mydb = connectToDB()
  mycursor = mydb.cursor()

  # to create or replace a blog
  if not toDelete:
    # check if blog already exists
    # if it does, ask player if they want to swap the blogs
    doSwap = False
    sql = "SELECT * FROM BlogSnippets WHERE title = %s"
    val = (title, )
    mycursor.execute(sql, val)
    myresult = mycursor.fetchall()
    if len(myresult) != 0:
      strTime = myresult[0][3].strftime('%m/%d/%Y')
      print(f'\nWARNING: A blog already exists with the title "{title}":')
      print(
        f'\nBlog ID: {myresult[0][0]}',
        f'\nTitle: {myresult[0][1]}',
        f'\nDesc: {myresult[0][2]}',
        f'\nDate: {strTime}\n'
      )
      doRepeat = True
      while doRepeat:
        userConfirm = input("Would you like to replace it (y or n)? ").lower()
        if userConfirm == 'yes' or userConfirm == 'y':
          doRepeat = False
          doSwap = True
          break
        elif userConfirm == 'no' or userConfirm == 'n':
          print("Terminating program...")
          exit(0)

    if (doSwap):
      print("Deleting a blog!")
      deleteBlog(title, mycursor)
    print("Creating a blog!")
    createBlog(title, desc, content, mycursor)

  # to delete a blog
  else:
    print("Deleting a blog!")
    deleteBlog(title, mycursor)

  mydb.commit()

'''
miniterminal
delete blogs (in both tables) using title
create entirely new blogs (if title already exists, ask them if they want to delete THIS [print the blog])
'''