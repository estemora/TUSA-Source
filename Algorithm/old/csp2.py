import copy
from operator import index
import yaml
import os
import mysql.connector
from mysql.connector import Error

class csp:

    # pass in all information from profile1
    def __init__(self, degree:str, status:str, min_credit:int, max_credit:int, course_taken_unit:list, course_request_unit:list, course_list:list, fullOrPartTime:str, currentSemester:str, currentYear:str, prerequisites:list, required_program_courses:list):
        self.degree = degree
        self.status = status
        self.min_credit = min_credit
        self.max_credit = max_credit
        self.course_taken_unit = course_taken_unit
        self.course_request_unit = course_request_unit
        self.course_list = course_list
        self.fullOrPartTime = fullOrPartTime
        self.prerequisites = prerequisites
        self.currentSemester = currentSemester
        self.currentYear = currentYear
        self.required_program_courses = required_program_courses
        #print(prerequisites)

    def add_courses(self):

        # go down the list of courses, this list is created by main. If a course violates a hard constraint, remove it from the list 

        courses = self.course_list
        prerequisites = self.prerequisites

        print("COURSE SIZE")
        print(len(courses))

        print("Going in")
        #for course in courses:
            #print(course.get("courseName"))

        #this must go first, it is dependent on the whole course list
        courses = self.removeMissingCoursesPrereqs(courses,prerequisites)
        print("after remove prereq")
        for course in courses:
            print(course.get("courseName"))

        courses = self.removeTakenCourses(courses)
        print("after remove takenAlready")
        for course in courses:
            print(course.get("courseName"))

        courses = self.removeStatusCourses(courses)
        print("after remove status")
        for course in courses:
            print(course.get("courseName"))

        #courses = self.removeMissingCoursesPrereqs(courses,prerequisites)
        #print("after remove prereq")
        for course in courses:
            print(course.get("courseName"))
        courses = self.removeWrongYear(courses)
        print("after remove year")
        for course in courses:
            print(course.get("courseName"))
        courses = self.removeWrongSemester(courses)
        print("after remove semester")
        for course in courses:
            print(course.get("courseName"))

        print("done")

        print("COURSE SIZE2")
        print(len(courses))
        #print(courses)
        return courses

    # going through the course_taken_list and removing all those courses from the course list
    def removeTakenCourses(self, course_list):

        newCourseList = []

        for course in course_list:
            takenAlready = False
            for taken_unit in self.course_taken_unit:
                if course.get("courseId") == taken_unit:
                    takenAlready = True 
                    print("REMOVE Taken")
                    print(course.get("courseName"))
            if takenAlready == False:
                newCourseList.append(course) 

        return newCourseList

    # if the current year of the student conflicts with the course, return true 
    def removeStatusCourses(self, course_status_list):

        newCourseList = []
        removeCourse = False

        for course in course_status_list:
            removeCourse = False
            for prerequisite in self.prerequisites:
                if prerequisite.get("courseId") == course.get("courseId"):

                    if self.status == "Freshman": 
                        if  "Junior" in prerequisite.get("prerequisiteId") or "Senior" in prerequisite.get("prerequisiteId") or "junior" in prerequisite.get("prerequisiteId") or "senior" in prerequisite.get("prerequisiteId"):
                            removeCourse = True
                            print("REMOVE Status")
                            print(course.get("courseName"))
                            break   

                    if self.status == "Sophomore": 
                        if "Junior" not in prerequisite.get("prerequisiteId") and "Senior" in prerequisite.get("prerequisiteId") and "junior" in prerequisite.get("prerequisiteId") and "senior" in prerequisite.get("prerequisiteId"):
                            removeCourse = True
                            print("REMOVE Status")
                            print(course.get("courseName"))
                            break  

                    if self.status == "Junior": 
                        if "Senior" in prerequisite.get("prerequisiteId") or "sophmore" in prerequisite.get("prerequisiteId") or "Sophmore" in prerequisite.get("prerequisiteId") or "senior" in prerequisite.get("prerequisiteId"):
                            removeCourse = True
                            print("REMOVE Status")
                            print(course.get("courseName"))
                            break

            if removeCourse == False:
                newCourseList.append(course)
        return newCourseList

    # if the course requires taking another course and it is in taken courses, return true
    def removeMissingCoursesPrereqs(self, course_prereq_list, prerequisites):

        newCourseList = []
        #print(prerequisites)

        for course in course_prereq_list:
            keepCourse = False
            hasPrereqs = False
            for prerequisite in prerequisites:
                if prerequisite.get("courseId") == course.get("courseId"):
                    neededPrerequisite = prerequisite.get("prerequisiteId")
                    hasPrereqs = True

                    # going down the list of taken classes and find the course name of the connected to the taken courseId
                    for newCourse in course_prereq_list:
                        newCourseName = newCourse.get("courseName").replace("-"," ")
                        if newCourseName in neededPrerequisite: 
                            courseId = newCourse.get("courseId")
                            for taken_unit in self.course_taken_unit:
                                print("taken unit")
                                print(taken_unit)
                                print("Course id")
                                print(courseId)
                                if taken_unit in courseId:
                                    keepCourse = True
                        #else:
                            #print("remove doesnt have course prereq")
                            #print(course.get("courseName"))

                #else:
                    #print("remove has prereqs")
                    #print(course.get("courseName"))
            if hasPrereqs == False or keepCourse == True: 
                newCourseList.append(course)

        return newCourseList

    def removeWrongYear(self, course_list):

        newCourseList = []

        if self.currentYear == "Even":
            for course in course_list:
                if course.get("year") != "ODD":
                    newCourseList.append(course)
                else:
                    print("remove removeWrongYear")
                    print(course.get("courseName"))
        elif self.currentYear == "Odd":
            for course in course_list:
                if course.get("year") != "EVEN":
                    newCourseList.append(course)
                else:
                    print("remove removeWrongYear")
                    print(course.get("courseName"))

        return newCourseList

    def removeWrongSemester(self, course_list):

        newCourseList = []

        if self.currentSemester == "Winter":
            for course in course_list:
                if course.get("semester") == "WNTER" or course.get("semester") == "FA&WI" or course.get("semester") == "WI&MA" or course.get("semester") == "":
                    newCourseList.append(course)
                else:
                    print("remove removeWrongSemester")
                    print(course.get("courseName"))
        elif self.currentSemester == "Fall":
            for course in course_list:
                if course.get("semester") == "FALL" or course.get("semester") == "FA&WI" or course.get("semester") == "":
                    newCourseList.append(course)
                else:
                    print("remove removeWrongSemester")
                    print(course.get("courseName"))

        return newCourseList

    def csp_backtracking(self):
        
        global set_solutions

        set_solutions = [] #List of available schedule which are consistent with all constraints

        credit_cnt = 0 #Number of credits

        possible_courses = csp.add_courses(self) #Possible courses which are only filtered by students profile so far.  

        csp.backtracking_hard_constraint(self, possible_courses, [], credit_cnt)
        return "done"

    def isgoal(self, credit, assignment):
        required_program_courses = self.required_program_courses
        #Check whether the current assignment is our goal.
        # min_credit < assignment_credit < max_credit

        creditGoal = False

        if credit >= int(self.min_credit) and credit <= float(self.max_credit): 
            creditGoal = True

        degreeGoal = False

        assignment2 = assignment
        

        if self.degree == "CS":
            for course in assignment:
                for required_program_course in required_program_courses:
                    if self.status in required_program_course.get("status"):
                        if self.currentSemester in required_program_course.get("semester"):
                            if "Computer Science" in required_program_course.get("programName"):
                                if required_program_course.get("courseId") == course.get("courseId"):
                                    print("hope")
                                    degreeGoal = True

                if degreeGoal == True and creditGoal == True:
                    #print("*")
                    return "Yes"

                else:
                    return "No"


    def forwardchecking(self,current, possible_variables, credit):

        #Variable : Course / Domain : Taken or Not taken

        #Constraints
        # 1) Less than max_credit - keep this
        # 2) The courses should not be overlapped - this is based on timetables, removed
        # 3) The course code of each courses should be different.(except laboratory course) - keep this 

        # If a variable(course) cannot satisfy all of the constraints,
        #   The variable is "Not taken."   
        #   The variable is removed in the list of "next possible variables."
        

        next_possible_variables = copy.deepcopy(possible_variables)

        next_credit = credit + int(current.get("credits"))
        #index = 1

        # if current course plus another course is to many credits, remove course, 
        # also removes current course so it cant be added twice
        credit_limit = int(self.max_credit) - 0.25
        #if credit >= credit_limit:
            #return next_possible_variables
        #else:
        for course in possible_variables:

            ismorecredit = next_credit + int(course.get("credits")) > float(self.max_credit) 
            issamecourse = course.get("courseId") == current.get("courseId")

            if ismorecredit or issamecourse:
                next_possible_variables.remove(course)
                #print("REMOVED")
                #print (index)
                #index += 1
        return next_possible_variables


    def backtracking_hard_constraint(self, possible_variables, assignment, credit):
        #print(assignment)
        # If the current assignment is goal, the goal is added in list of solutions. Else, just pass.
        # There is no return as there are possibilities that more courses can be added.
        if csp.isgoal(self,credit, assignment) == "Yes":

            new = []
        
            # add course to list of set solutions
            for course in assignment:
                new.append((course.get("courseId"), course.get("courseName")))
            # new.sort()

            # set_solutions.append(list(assignment))
            set_solutions.append(new)

        elif csp.isgoal(self,credit, assignment) == "No":
            pass

        #Return "failure" if there are no possible variables.
        if possible_variables == []:
            return "failure"

        else:

            for current in possible_variables:
                #print (current.get("courseName"))

                x = csp.forwardchecking(self, current, possible_variables, credit)
                            
                assignment.append(current)
                credit += int(current.get("credits"))

                result = csp.backtracking_hard_constraint(self, x, assignment, credit)

                if result != "failure":
                    return result

                assignment.remove(current)
                credit -= int(current.get("credits"))

        return "failure"

    
    #The entire set of solutions(Raw version)
    # [[{course data}, {course data}] , [{course data}, {course data}, {course data}]........]
    #   -----------------------------   =============================================
    #           SOLUTION 1                                SOLUTION 2                 ........
    def hard_constraint_solutions(self, filename):
        print(set_solutions[0])
        if filename == "profile1":
            file = open("output1.txt", "w")
            file.write("Solution 1")
            file.write("\n")
            file.write(str(set_solutions[0][0][1]))
            file.write("\n")
            file.write(str(set_solutions[0][1][1]))
            file.write("\n")
            file.write(str(set_solutions[0][2][1]))
            file.write("\n")
            file.write(str(set_solutions[0][3][1]))
            file.write("\n")
            file.write("\n")
            file.write("Solution 2")
            file.write("\n")
            file.write(str(set_solutions[70][0][1]))
            file.write("\n")
            file.write(str(set_solutions[70][1][1]))
            file.write("\n")
            file.write(str(set_solutions[70][2][1]))
            file.write("\n")
            file.write(str(set_solutions[70][3][1]))
            file.close()
        
        if filename == "Profile2":
            file = open("output2.txt", "w")
            file.write("Solution 1")
            file.write("\n")
            file.write(str(set_solutions[0][0][1]))
            file.write("\n")
            file.write(str(set_solutions[0][1][1]))
            file.write("\n")
            file.write(str(set_solutions[0][2][1]))
            file.write("\n")
            file.write(str(set_solutions[0][3][1]))
            file.write("\n")
            file.write("\n")
            file.write("Solution 2")
            file.write("\n")
            file.write(str(set_solutions[70][0][1]))
            file.write("\n")
            file.write(str(set_solutions[70][1][1]))
            file.write("\n")
            file.write(str(set_solutions[70][2][1]))
            file.write("\n")
            file.write(str(set_solutions[70][3][1]))
            file.close()

        if filename == "Profile3":
            file = open("output3.txt", "w")
            file.write("Solution 1")
            file.write("\n")
            file.write(str(set_solutions[0][0][1]))
            file.write("\n")
            file.write(str(set_solutions[0][1][1]))
            file.write("\n")
            file.write(str(set_solutions[0][2][1]))
            file.write("\n")
            file.write(str(set_solutions[0][3][1]))
            file.write("\n")
            file.write("\n")
            file.write("Solution 2")
            file.write("\n")
            file.write(str(set_solutions[70][0][1]))
            file.write("\n")
            file.write(str(set_solutions[70][1][1]))
            file.write("\n")
            file.write(str(set_solutions[70][2][1]))
            file.write("\n")
            file.write(str(set_solutions[70][3][1]))
            file.close()
        return set_solutions


    
    # Filter out soft constraints
    def soft_constraints(self):
        global possible_solution
        possible_solution = set_solutions[::]

        
        c = []
        for k in self.course_request_unit:
            temp = k['request'].split('-')
            if len(temp) > 1:
                c.append((temp[0], int(temp[1]), k['preference']))
            else:
                c.append((temp[0], -1, k['preference']))                     # -1 is a placeholder of section num when it is unknown in requests.
        
        requested_course = list(map(list, zip(*c)))[0]
        requested_section = list(map(list, zip(*c)))[1]
        requested_preference = list(map(list, zip(*c)))[2]

        # calculating weights depending on how many courses in possible solutions are matching with lists in requests
        for i in possible_solution:
            #Calculating day_weight it is 0 because we have no day preference
            day_weight = 0
            
            #Calculating course preference
            temp_course = list(map(list, zip(*i)))[0]
            temp_sec = list(map(list, zip(*i)))[1]
            
            if temp_course == requested_course:
                # count_matching = calculating course preference, day_weight = calculating day preference
                # final_weight = count_matching * 0.5 + day_weight * 0.5
                i.append((len(temp) + sum(requested_preference))*0.6 + day_weight*0.4)
            else:
                a = set(requested_course).intersection(set(temp_course))
                count_matching = len(a)
                for c in a: 
                    idx_s1 = temp_course.index(c)
                    idx_s2 = requested_course.index(c)
                    if requested_section[idx_s2] != -1 and int(temp_sec[idx_s1]) != requested_section[idx_s2]:
                        count_matching -= 1
                    else:
                        if requested_preference[idx_s2] < 0:
                            count_matching -= 100                               # If there is a course that a student doesn't want to take it, calculate as -100 (consider ignoring)
                        else:
                            count_matching += requested_preference[idx_s2]

                # count_matching = calculating course preference, day_weight = calculating day preference
                # final_weight = count_matching * 0.6 + day_weight * 0.4
                i.append(count_matching*0.6 + day_weight*0.4)
                count_matching = 0
                day_weight = 0

        possible_solution.sort(key = lambda x: x[-1], reverse=True)
        print(possible_solution)
        self.maximize_soft_constraints(possible_solution)

    # Find solutions with maximum number of soft constraints
    def maximize_soft_constraints(self, possible_solution):
        global solution
        solution = [x for x in possible_solution if x[-1]> 0 and self.status_checking(x[:-1])]

        # max = solution[0][-1]
        # cnt = 0
        # for i in solution:
        #     if i[-1] != max:
        #         break
        #     else:
        #         cnt+= 1
        #         print(i)
        # print(cnt)
        print(solution)
        print(len(solution))
        
        return [x for x in possible_solution if x[-1]> 0 and self.status_checking(x[:-1])] 

    def yml(self):
        dir_courseName = os.getcwd()

        for index in range(5):
            with open(dir_courseName + "\\new" + str(index) + ".yml", 'w') as file:
                documents = yaml.dump("Schedule", file)
        

        