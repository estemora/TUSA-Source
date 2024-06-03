import os
import sys
import mysql.connector
from mysql.connector import Error
import csp

# read in information from the database and write it to a file

def create_profile(connection, student, filename):

    cursor = connection.cursor()
    cursor = connection.cursor(buffered=True)
    student_name = student

    # holds degree and track
    cursor.execute("""SELECT * FROM StudentProgram WHERE userName = %s""", (student,))
    StudentProgram_data = cursor.fetchall()
    print(StudentProgram_data)
    studentDegree = StudentProgram_data[0][1]
    studentTrack = StudentProgram_data[0][3]
    print("Student Degree")
    print(studentDegree)
    print("Student Track")
    print(studentTrack)


    # holds status
    cursor.execute("""SELECT * FROM userInfo WHERE userName = %s""", (student,))
    Student_data = cursor.fetchall()
    #print(Student_data)
    status = Student_data[0][7]

    currentSemester = "Fall" # this can change if users have the ability to set their semester in perferences

    #if fullOrPartTime: # this can change when fullOrPartTime is a thing in perferences
    fullOrPartTime = "Full-time" # default 
    min_credit = 4
    max_credit = 4 

    anticipatedGradYear = Student_data[0][5]
    currentYear = anticipatedGradYear - 4 # this can change if we have a preference of how many years/semesters they want the algorithm to run for
    if currentYear % 2 == 0:
        currentYearEvenOrOdd = "Even"
    else: 
        currentYearEvenOrOdd = "Odd"

    print("Status")
    print(status)
    print("currentYear")
    print(currentYear)

    # holds courses taken
    # not connected to website yet, manually inserted 
    cursor.execute("""SELECT * FROM CoursesTaken where userName = %s""", (student,))
    CoursesTaken_data = cursor.fetchall()
    for courses in CoursesTaken_data:
        print(courses[1])

    # holds instructionalStyle, ProgramName, CourseId, ForeignLanguage
    #cursor.execute("""SELECT * FROM StudentPreferences where userName = %s""", (student,))
    #StudentPreferences_data = cursor.fetchall()
    #print(StudentPreferences_data)
    #instructionalStyle = StudentPreferences_data[0][1]
    #programName = StudentPreferences_data[0][2]
    #courseId = StudentPreferences_data[0][3]
    #foreignLanguage = StudentPreferences_data[0][4]

    print("###")
    cursor.execute("""SELECT * FROM StudentPreferencesPrograms where userName = %s""", (student,))
    studentProgram = cursor.fetchall()
    print("Student Program *")
    print(studentProgram)
    programList = []
    i = 0 
    while i < len(studentProgram):
        print(studentProgram[i][1])
        programList.append(studentProgram[i][1])
        i += 1

    cursor.execute("""SELECT * FROM StudentPreferencesStyles where userName = %s""", (student,))
    studentStyles = cursor.fetchall()
    print("Student Styles *")
    print(studentStyles)
    styleList = []
    i = 0 
    while i < len(studentStyles):
        print(studentStyles[i][1])
        styleList.append(studentStyles[i][1])
        i += 1

    cursor.execute("""SELECT * FROM StudentPreferencesCourses where userName = %s""", (student,))
    studentCourses = cursor.fetchall()
    print("Student Courses *")
    print(studentCourses)
    CourseList = []
    i = 0 
    while i < len(studentCourses):
        print(studentCourses[i][1])
        styleList.append(studentCourses[i][1])
        i += 1

    cursor.execute("""SELECT * FROM StudentPreferencesLanguages where userName = %s""", (student,))
    studentLanguages = cursor.fetchall()
    print("Student Languages *")
    print(studentLanguages)
    if len(studentLanguages) == 0:
        foreignLanguage = None
    else:
        foreignLanguage = studentLanguages[0][1]
    print(foreignLanguage)

    cursor.execute("""SELECT * FROM StudentNegativeCoursePreference where userName = %s""", (student,))
    studentNegativeCourses = cursor.fetchall()
    print("Student Negative Courses *")
    print(studentNegativeCourses)
    negativeCourseList = []
    i = 0 
    while i < len(studentNegativeCourses):
        print(studentNegativeCourses[i][1])
        negativeCourseList.append(studentNegativeCourses[i][1])
        i += 1

    print("TEST1")
    print(len(negativeCourseList))
    print(negativeCourseList)

    cursor.execute("""SELECT * FROM StudentNegativeProgramPreference where userName = %s""", (student,))
    studentNegativePrograms = cursor.fetchall()
    print("Student Negative Programs *")
    print(studentNegativePrograms)
    negativeProgramList = []
    i = 0 
    while i < len(studentNegativePrograms):
        print(studentNegativePrograms[i][1])
        negativeProgramList.append(studentNegativePrograms[i][1])
        i += 1

    print("TEST2")
    print(len(negativeProgramList))
    print(negativeProgramList)

    fileName = filename + ".txt"
    file = open(fileName, "w")

    print("STARTS here")
    file.write("#degree")
    file.write("\n")
    if studentDegree == None:
        file.write("null")
        file.write("\n")
    else:
        file.write(studentDegree)
    file.write("\n")
    file.write("\n")

    file.write("#degree_status")
    file.write("\n")
    if status == None:
        file.write("null")
        file.write("\n")
    else:
        file.write(status)
    file.write("\n")
    file.write("\n")

    file.write("#degree_track")
    file.write("\n")

    if studentTrack == None:
        file.write("null")
        file.write("\n")
    else:
        file.write(studentTrack)
    file.write("\n")
    file.write("\n")

    file.write("#min_credit")
    file.write("\n") 
    if str(min_credit) == None:
        file.write("null")
        file.write("\n")
    else:
        file.write(str(min_credit))
    file.write("\n")
    file.write("\n")
    file.write("#max_credit")
    file.write("\n") 
    if str(max_credit) == None:
        file.write("null")
        file.write("\n")
    else:
        file.write(str(max_credit))
    file.write("\n")
    file.write("\n")

    file.write("#course_taken_unit")
    file.write("\n")
    for courses in CoursesTaken_data:
        print("Printng taken courses")
        print(courses[1])
        file.write(str(courses[1]))
        file.write("\n")
    file.write("\n")

    file.write("#fullOrPartTime")
    file.write("\n")
    if fullOrPartTime == None:
        file.write("null")
        file.write("\n")
    else:
        file.write(fullOrPartTime)
    file.write("\n")
    file.write("\n")

    file.write("#currentSemester")
    file.write("\n")
    if currentSemester == None:
        file.write("null")
        file.write("\n")
    else:
        file.write(currentSemester)
    file.write("\n")
    file.write("\n")

    file.write("#currentYear")
    file.write("\n")
    if str(currentYear) == None: # is this currentYearEvenOrOdd or currentYear?
        file.write("null")
        file.write("\n")
    else:
        file.write(str(currentYearEvenOrOdd))
    file.write("\n")
    file.write("\n")

    file.write("#instructionalStyle")
    file.write("\n")
    if len(styleList) == 0:
        file.write("null")
        file.write("\n")
    else:
        i = 0 
        while i < len(studentStyles):
            file.write(studentStyles[i][1])
            file.write("\n")
            i += 1
    file.write("\n")

    file.write("#program")
    file.write("\n")
    if len(programList) == 0:
        file.write("null")
        file.write("\n")
    else:
        i = 0 
        while i < len(studentProgram):
            file.write(studentProgram[i][1])
            file.write("\n")
            i += 1
    file.write("\n")

    file.write("#courseId")
    file.write("\n")
    if len(studentCourses) == 0:
        file.write("null")
        file.write("\n")
    else:
        i = 0 
        while i < len(studentCourses):
            file.write(str(studentCourses[i][1]))
            file.write("\n")
            i += 1
    file.write("\n")

    file.write("#foreignLanguage")
    file.write("\n")
    if foreignLanguage == None:
        file.write("null")
    else:
        file.write(foreignLanguage)
    file.write("\n")
    file.write("\n")

    file.write("#negativeCourseId")
    file.write("\n")
    if len(negativeCourseList) == 0:
        file.write("null")
        file.write("\n")
    else:
        i = 0 
        while i < len(negativeCourseList):
            file.write(str(negativeCourseList[i]))
            file.write("\n")
            i += 1
    file.write("\n")

    file.write("#negativeProgram")
    file.write("\n")
    if len(negativeProgramList) == 0:
        file.write("null")
        file.write("\n")
    else:
        i = 0 
        while i < len(negativeProgramList):
            file.write(str(negativeProgramList[i]))
            file.write("\n")
            i += 1
    file.write("\n")

    return file

# read student profile, example: profile1
def read_profile(filename):
    file = filename + '.txt'
    with open(file) as file:
        profile = file.read().replace('\n',' ').split('#')
    for i in profile[1:]:
        temp = i.split(' ')
        if temp[0] == 'degree':
            degree = temp[1]
        elif temp[0] == 'degree_status':
            status = temp[1]    
        elif temp[0] == 'degree_track':
            track = temp[1]
        elif temp[0] == 'min_credit':
            min_credit = temp[1]
        elif temp[0] == 'max_credit':
            max_credit = temp[1]
        elif temp[0] == 'course_taken_unit':
            course_taken_unit = []
            for t in temp[1:]:
                if len(t) > 0:
                    course_taken_unit.append(t)
        elif temp[0] == 'fullOrPartTime':
            fullOrPartTime = temp[1]
        elif temp[0] == 'currentSemester':
            currentSemester = temp[1]
        elif temp[0] == 'currentYear':
            currentYear = temp[1]
        elif temp[0] == 'instructionalStyle':
            instructionalStyle = []
            for t in temp[1:]:
                if len(t) > 0:
                    instructionalStyle.append(t)
        elif temp[0] == 'program':
            program = []
            for t in temp[1:]:
                if len(t) > 0:
                    program.append(t)
        elif temp[0] == 'courseId':
            courseId = []
            for t in temp[1:]:
                if len(t) > 0:
                    courseId.append(t)
        elif temp[0] == 'foreignLanguage':
            foreignLanguage = temp[1]
        elif temp[0] == 'negativeCourseId':
            negativeCourseId = []
            for t in temp[1:]:
                if len(t) > 0:
                    negativeCourseId.append(t)
        elif temp[0] == 'negativeProgram':
            negativeProgram = []
            for t in temp[1:]:
                if len(t) > 0:
                    negativeProgram.append(t)
    return degree, status, track, min_credit, max_credit, course_taken_unit, fullOrPartTime, currentSemester, currentYear, instructionalStyle, program, courseId, foreignLanguage, negativeCourseId, negativeProgram

# Read Course list information from database
# course list and prerequisite information are something called dictionaries. They are also a list of dictionaries
def read_data_from_database(connection):
    cursor = connection.cursor()

    query_courses = "SELECT * FROM Courses"
    cursor.execute(query_courses)
    courses_data = cursor.fetchall()
    courses = []
    for row in courses_data:
        course = {
            "courseName": row[0],
            "courseId": row[1],
            "courseTitle": row[2],
            "description": row[3], 
            "instructionalStyle": row[4],
            "credits": row[5],
            "semester": row[6],
            "year": row[7],
            "fullOrHalfTerm": row[8],
            "gradingStyle": row[9],
            "program": row[10],
            "courseRepresentation": row[11],
        }
        courses.append(course)

    query_prerequisites = "SELECT * FROM Prerequisites"
    cursor.execute(query_prerequisites)
    prerequisites_data = cursor.fetchall()

    prerequisites = []
    for row in prerequisites_data:
        prerequisite = {
        "courseId": row[0],
        "prerequisiteId": row[1]
        }
        prerequisites.append(prerequisite)

    query_requiredProgramCourses = "SELECT * FROM RequiredProgramCourses"
    cursor.execute(query_requiredProgramCourses)
    requiredProgramCourses_data = cursor.fetchall()

    requiredProgramCourses = []
    for row in requiredProgramCourses_data:
        required_program_course = {
        "programName": row[0],
        "majorOrMinor": row[1],
        "courseId": row[2],
        "minGrade": row[3],
        "electiveOrRequired": row[4],
        "allied": row[5],
        "trackName": row[6],
        "trackRequiredOrElective": row[7],
        "choiceCourses": row[8],
        "choiceCourses2": row[9],
        "status": row[10],
        "semester": row[11],
        "year": row[12]
        }
        requiredProgramCourses.append(required_program_course)

    query_electives = "SELECT * FROM ElectiveProgramCourses"
    cursor.execute(query_electives)
    electives_data = cursor.fetchall()

    electives = []
    for row in electives_data:
        elective = {
        "programName": row[0],
        "majorOrMinor": row[1],
        "courseId": row[2],
        "electiveType": row[3],
        "trackName": row[4]
        }
        electives.append(elective)

    cursor.close()
    return courses, prerequisites, requiredProgramCourses, electives

if __name__ == "__main__":

    filename = sys.argv[1]
    username = sys.argv[2]
    print("username: ")
    print(username)
    
    print("filename: ")
    print(filename)
    print(username + "Profile1") 
    
    try:
        connection = mysql.connector.connect(
            host="10.20.3.4",
            user='dbms_tusa',
            password='falldogumbrellashirt24',
            database='tusa_db'
        )

        if connection.is_connected():
            print("Connected to tusa_db")

            if filename == username + "Profile1":

                create_profile(connection, sys.argv[2], filename)
                print("Filename: ")
                print(filename)

            # Read profile and course/prerequisites data from the database
            degree, status, track, min_credit, max_credit, course_taken_unit, fullOrPartTime, currentSemester, currentYear,  instructionalStyle,  program, courseId, foreignLanguage, negativeCourseId, negativeProgram = read_profile(filename)
            course_list, prerequisites, required_program_courses, electives = read_data_from_database(connection)

            #print("TESTING in main")
            #for course in course_list:
                #print(list(course.values()))
                #print(course.get("courseId"))

            # CSP
            CSP = csp.csp(degree, status, track, min_credit, max_credit, course_taken_unit, course_list, fullOrPartTime, currentSemester, currentYear, instructionalStyle, program, courseId, foreignLanguage, prerequisites, required_program_courses, username, electives, negativeCourseId, negativeProgram)
            print(currentSemester)
            print(currentYear)
            print("*****")
            if "Winter" in currentSemester or "Fall" in currentSemester:
                print("Going into BACKTRACKING")
           #CSP.add_courses()
                CSP.csp_backtracking()
                print("DONE BACKTRACKING")
            if "May" in currentSemester:
               CSP.may_schedule()
           #z = CSP.soft_constraints() #ignoring soft constraints for now 
           #CSP.yml()
            CSP.hard_constraint_solutions(filename)
           # Generate pdf files for solutions
            #for i in range(5):
                #cmd = "pdfschedule "+"new"+str(i)+".yml"
                #os.system(cmd)

    except Error as e:
        print("Error: ", e)

    finally:
        if connection.is_connected():
            connection.close()
            print("Connection closed")