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
        "-d             :             Delete a blog given its title.\n" +
        "-g             :             Get a blog given its title.\n" +
        "-c             :             Create a blog given a title, description, and code.", file=sys.stderr)
  exit(1)


def parseArgs(args: list[str]) -> tuple:
  '''
  [0] Are we deleting a blog?
  [1] Are we getting a blog?
  [2] Are we creating a blog?
  '''
  output = [False, False, False]
  occurBools = [False, False, False]
  for i in range(1, len(args)):
    if args[i] == '-d':
      if occurBools[0] or occurBools[1] or occurBools[2]:
        printUsage()
      output[0] = True
      occurBools[0] = True
    elif args[i] == '-g':
      if occurBools[1] or occurBools[0] or occurBools[2]:
        printUsage()
      output[1] = True
      occurBools[1] = True
    elif args[i] == '-c':
      if occurBools[1] or occurBools[0] or occurBools[2]:
        printUsage()
      output[2] = True
      occurBools[2] = True
    else:
      printUsage()

  if not output[0] and not output[1] and not output[2]:
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
  file = open("input.txt")
  lines = file.readlines()
  title = lines[1][:-1]
  desc = lines[4][:-1]
  content = ''
  for contentLine in lines[7:]:
    content += contentLine
  return (title, desc, content)


if __name__ == '__main__':
  ARGS = parseArgs(sys.argv)
  # print(ARGS)
  title, desc, content = readBlog()

  mydb = connectToDB()
  mycursor = mydb.cursor()

  # check if we're just getting a blog
  if ARGS[1]:
    print("Getting blog!")
    sql = "SELECT * FROM FullBlogs INNER JOIN BlogSnippets ON FullBlogs.title = BlogSnippets.title WHERE BlogSnippets.title = %s"
    val = (title, )
    mycursor.execute(sql, val)
    myresult = mycursor.fetchall()
    if len(myresult) == 0:
      print("Error: there are no blogs with the title \"%s\""%(title), file=sys.stderr)
      exit(1)
    
    # write the retrieved blog to a new text file
    file = open('output.txt', 'w')
    file.writelines([
      f'Title:\n{myresult[0][1]}\n\n',
      f'Description:\n{myresult[0][5]}\n\n',
      f'Blog Code:\n{myresult[0][2]}'
    ])

  # to create or replace a blog
  elif ARGS[2]:
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
  elif ARGS[0]:
    print("Deleting a blog!")
    deleteBlog(title, mycursor)

  else:
    print("Error: failed to read arguments.", file=sys.stderr)
    exit(1)

  mydb.commit()