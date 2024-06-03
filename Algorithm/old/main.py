import os
import sys
import mysql.connector
from mysql.connector import Error
import csp

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
        elif temp[0] == 'min_credit':
            min_credit = temp[1]
        elif temp[0] == 'max_credit':
            max_credit = temp[1]
        elif temp[0] == 'course_taken_unit':
            course_taken_unit = []
            for t in temp[1:]:
                if len(t) > 0:
                    course_taken_unit.append(t)
        elif temp[0] == 'course_request_unit':
            course_request = []
            for t in temp[1:]:
                if len(t) > 0:
                    dic = {}
                    dic['request'] = t.split('_')[0]
                    dic['unit'] = t.split('_')[1]
                    dic['preference'] = int(t.split('_')[2])
                    course_request.append(dic)
            course_request_unit = course_request
        elif temp[0] == 'fullOrPartTime':
            fullOrPartTime = temp[1]
        elif temp[0] == 'currentSemester':
            currentSemester = temp[1]
        elif temp[0] == 'currentYear':
            currentYear = temp[1]
    return degree, status, min_credit, max_credit, course_taken_unit, course_request_unit, fullOrPartTime, currentSemester, currentYear

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
            "professorEmail": row[2],
            "description": row[3],
            "prerequisite": row[4],
            "instructionalStyle": row[5],
            "credits": row[6],
            "fullOrHalfTerm": row[7],
            "gradingStyle": row[8],
            "program": row[9],
            "courseRepresentation": row[10],
            "courseTitle": row[11],
            "semester": row[12],
            "year": row[13]
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
        "choiceCourses": row[6],
        "trackName": row[7],
        "trackRequiredOrElective": row[8],
        "status": row[9],
        "semester": row[10],
        "year": row[11]
        }
        requiredProgramCourses.append(required_program_course)

    cursor.close()
    return courses, prerequisites, requiredProgramCourses

if __name__ == "__main__":
    filename = sys.argv[1]

    try:
        connection = mysql.connector.connect(
            host="10.20.3.4",
            user='dbms_tusa',
            password='falldogumbrellashirt24',
            database='tusa_db'
        )

        if connection.is_connected():
            print("Connected to tusa_db")

            # Read profile and course/prerequisites data from the database
            degree, status, min_credit, max_credit, course_taken_unit, course_request_unit, fullOrPartTime, currentSemester, currentYear = read_profile(filename)
            course_list, prerequisites, required_program_courses = read_data_from_database(connection)

            #print("TESTING in main")
            #for course in course_list:
                #print(list(course.values()))
                #print(course.get("courseId"))

            # CSP
            CSP = csp.csp(degree, status, min_credit, max_credit, course_taken_unit, course_request_unit, course_list, fullOrPartTime, currentSemester, currentYear, prerequisites, required_program_courses)
            print("Going into BACKTRACKING")
            #CSP.add_courses()
            CSP.csp_backtracking()
            print("DONE BACKTRACKING")
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