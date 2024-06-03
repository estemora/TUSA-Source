import copy
from operator import index
import yaml
import os
import stat 
import mysql.connector
from mysql.connector import Error

#if you are doing testing, please make sure the courses required for whatever major you are using are in the database
#else, just put a random major such as "na"

class csp:

    # pass in all information from profile1
    def __init__(self, degree:str, status:str, track:str, min_credit:int, max_credit:int, course_taken_unit:list, course_list:list, fullOrPartTime:str, currentSemester:str, currentYear:str,  instructionalStyle: list, program:list, courseId:list, foreignLanguage:str, prerequisites:list, required_program_courses:list, username:str, electives:list, negativeCourseId: list, negativeProgram: list):
        self.degree = degree
        self.status = status
        self.track = track
        self.min_credit = min_credit
        self.max_credit = max_credit
        self.course_taken_unit = course_taken_unit
        self.course_list = course_list
        self.fullOrPartTime = fullOrPartTime
        self.prerequisites = prerequisites
        self.currentSemester = currentSemester
        self.currentYear = currentYear
        self.required_program_courses = required_program_courses
        self.instructionalStyle = instructionalStyle
        print("***")
        print(instructionalStyle)
        self.program = program
        print(program)
        self.courseId = courseId
        print(courseId)
        self.foreignLanguage = foreignLanguage
        self.username = username
        self.electives = electives
        self.negativeCourseId = negativeCourseId
        self.negativeProgram = negativeProgram

        # this is a possible solution to not force users to input functions in order to be a CS major. 
        # we can do the same thing for the weird ACT required course in BIO
        if self.degree == "CS" or self.degree == "BIO":
            self.course_taken_unit.append("774")

    def add_courses(self):

        # go down the list of courses, this list is created by main. If a course violates a hard constraint, remove it from the list 

        courses = self.course_list
        prerequisites = self.prerequisites
        keepLowerCreditCourses = False
        offCampus = False
        internship = False
        experiential = False
        studioArt = False
        practicum = False
        independentStudy = False

        print("course list before")
        for course in courses:
            print(course.get("courseName"))
        print("COURSE SIZE")
        print(len(courses))

        print("Going in")
        print("currentSemester", self.currentSemester)
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

        courses = self.removeWrongYear(courses)
        print("after remove year")
        for course in courses:
            print(course.get("courseName"))
        courses = self.removeWrongSemester(courses)
        print("after remove semester")
        for course in courses:
            print(course.get("courseName"))

        # if preference equals true, do not remove courses 
        courses = self.removeNotEnoughCredits(courses, keepLowerCreditCourses)
        print("after remove less than one credit")
        for course in courses:
            print(course.get("courseName"))

        courses = self.removeSpecialTopics(courses)
        print("after remove Special Topics")
        for course in courses:
            print(course.get("courseName"))

        # if preference equals true, do not remove courses 

        # CS only has lecture courses. This improves the speed for CS.
        if self.degree != "BIO" and self.degree != "digitalArtsMedia" and self.degree != "french": 
            courses = self.removeInstructionalStyles(courses, offCampus, internship, experiential, studioArt, practicum, independentStudy)
            print("after remove instructionalStyles")
            #print(courses)
            for course in courses:
                print(course.get("courseName"))

        courses = self.remove2000Courses(courses)
        print("after remove 2000 Courses")
        #print(courses)
        for course in courses:
            print(course.get("courseName"))

        courses = self.remove3000Courses(courses)
        print("after remove 3000 Courses")
        #print(courses)
        for course in courses:
            print(course.get("courseName"))

        courses = self.remove4000Courses(courses)
        print("after remove 4000 Courses")
        #print(courses)
        for course in courses:
            print(course.get("courseName"))

        courses = self.removeOtherPrograms(courses)
        print("After Removing other program Courses")
        for course in courses:
            print(course.get("courseName"))

        print("done")

        print("Final List")
        #print(courses)
        for course in courses:
            print(course.get("courseName"))

        print("COURSE SIZE2")
        print(len(courses))
        #print(courses)
        
        #sorting course list so highest credit courses goes first
        #courses = sorted(courses, key=lambda x: x.get("credits"), reverse=True)

        return courses

    # going through the course_taken_list and removing all those courses from the course list
    def removeTakenCourses(self, course_list):

        newCourseList = []

        for course in course_list:
            takenAlready = False
            for taken_unit in self.course_taken_unit:
                if str(course.get("courseId")) == taken_unit:
                    takenAlready = True 
                    #print("REMOVE Taken")
                    #print(course.get("courseName"))
            if takenAlready == False:
                newCourseList.append(course) 

        return newCourseList

    # if the current year of the student conflicts with the course, return true 
    def removeStatusCourses(self, course_status_list):

        newCourseList = []
        removeCourse = False

        # first-year is often used interchangably with freshman 

        for course in course_status_list:
            removeCourse = False
            for prerequisite in self.prerequisites:
                if prerequisite.get("courseId") == course.get("courseId"):

                    if self.status == "Freshman" or self.status == "First": 
                        if  "Junior" in prerequisite.get("prerequisiteId") or "Senior" in prerequisite.get("prerequisiteId") or "junior" in prerequisite.get("prerequisiteId") or "senior" in prerequisite.get("prerequisiteId")  or "sophmore" in prerequisite.get("prerequisiteId") or "Sophmore" in prerequisite.get("prerequisiteId"):
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
                        if "sophmore" in prerequisite.get("prerequisiteId") or "Sophmore" in prerequisite.get("prerequisiteId") or "first year" in prerequisite.get("prerequisiteId") or "first-year" in prerequisite.get("prerequisiteId") or "second year" in prerequisite.get("prerequisiteId") or "second-year" in prerequisite.get("prerequisiteId"):
                            removeCourse = True
                            print("REMOVE Status")
                            print(course.get("courseName"))
                            break

                    # Senior Seminar 
                    if self.status != "Senior":
                        if "Senior" in course.get("courseTitle"):
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
                #print(prerequisite.get("prerequisiteId"))
                if prerequisite.get("courseId") == course.get("courseId"):
                    #print(prerequisite.get("courseId"))
                    neededPrerequisite = prerequisite.get("prerequisiteId")
                    hasPrereqs = True

                    # Art-2364 only has prereqs for studioArt majors
                    if str(course.get("courseId")) == "2462":
                        if self.degree != "studioArt":
                            hasPrereqs = False 
                    # passing capstone and internship in digital arts they require junior or senior standing and then they should pass
                    if str(course.get("courseId")) == "2511":
                        hasPrereqs = False
                    if str(course.get("courseId")) == "2735":
                        hasPrereqs = False 
                    # passing BA-3084, its only prereq is standing and permission of instructor
                    if str(course.get("courseId")) == "190":
                        hasPrereqs = False
                    # passing Math-1144 its prereq is the ACT score
                    if str(course.get("courseId")) == "772":
                        hasPrereqs = False

                    # FYS in prereq comonly causes bugs, passing it manually
                    if "FYS-1104" in neededPrerequisite and "2079" in self.course_taken_unit or "FYS 1104" in neededPrerequisite and "2079" in self.course_taken_unit:
                        hasPrereqs = False

                    # going down the list of taken classes and finding the course name of the connected to the taken courseId
                    for newCourse in course_prereq_list:

                        # FYS-1104 has a dash between the program and the numbers when listed as a prereq, every other course needs to have this dash removed
                        # FYS-1104 is the only exception to this rule I was able to find
                        if newCourse.get("courseName") is not None and newCourse.get("courseName") != "FYS-1104" and newCourse.get("courseName") != "CS-3454":
                            newCourseName = newCourse.get("courseName").replace("-"," ")
                        elif newCourse.get("courseName") is not None and newCourse.get("courseName") == "FYS-1104":
                            newCourseName = "FYS-1104"
                        elif newCourse.get("courseName") is not None and newCourse.get("courseName") == "CS-3454":
                            newCourseName = "CS-3454"
                        #elif newCourse.get("courseName") == "MATH-1144":
                            #newCourseName = "MATH-1144"

                        if newCourseName in neededPrerequisite: 

                            courseId = str(newCourse.get("courseId"))
                            for taken_unit in self.course_taken_unit:
                                if str(taken_unit) in courseId:
                                    keepCourse = True
            if hasPrereqs == False or keepCourse == True: 
                newCourseList.append(course)
        return newCourseList

    def removeWrongYear(self, course_list):

        newCourseList = []

        if self.currentYear == "Even":
            for course in course_list:
                if course.get("year") == "ODD" or course.get("year") == "":
                    print("remove removeWrongYear")
                    print(course.get("courseName"))
                else:
                    newCourseList.append(course)
        elif self.currentYear == "Odd":
            for course in course_list:
                if course.get("year") == "EVEN" or course.get("year") == "":
                    print("remove removeWrongYear")
                    print(course.get("courseName"))
                else:
                    newCourseList.append(course)

        return newCourseList

    def removeWrongSemester(self, course_list):

        newCourseList = []

        if self.currentSemester == "Winter":
            for course in course_list:
                if course.get("semester") != "FALL" and course.get("semester") != "MAY" and course.get("semester") != "SUMMR" and course.get("semester") != "":
                    newCourseList.append(course)
            
        elif self.currentSemester == "Fall":
            for course in course_list:
                if course.get("semester") != "WNTER" and course.get("semester") != "MAY" and course.get("semester") != "WIMAY" and course.get("semester") != "SUMMR" and course.get("semester") != "":
                    newCourseList.append(course)

        elif self.currentSemester == "May":
            for course in course_list:
                if course.get("semester") == "MAY" or course.get("semester") == "WIMAY" or course.get("semester") == "ALL" and course.get("semester") != "SUMMR" and course.get("semester") != "":
                    newCourseList.append(course)

        return newCourseList

    def removeNotEnoughCredits(self, course_list, keepLowerCreditCourses):

        newCourseList = []

        for course in course_list:
            if course.get("credits") is not None and course.get("credits") >= 1:

                newCourseList.append(course)

            # Passing required half-credit bio courses
            elif self.degree == "BIO":
                if str(course.get("courseId")) == "2150":
                    newCourseList.append(course)
                if str(course.get("courseId")) == "2460":
                    newCourseList.append(course)

        return newCourseList

    def removeSpecialTopics(self, course_list):

        newCourseList = []

        for course in course_list:

            if "Special Topics" not in str(course.get("courseTitle")):
                newCourseList.append(course)
        return newCourseList

    def removeInstructionalStyles(self, course_list, offCampus, internship, experiential, studioArt, practicum, independentStudy):

        newCourseList = []

        # if one of these parameters is true, do not do these checks

        for course in course_list:
            canBeAdded = True

            if "Off-Campus/Study Abroad" in str(course.get("instructionalStyle")):
                canBeAdded = False

            if "Internship" in str(course.get("instructionalStyle")):
                canBeAdded = False
            
            if "Experiential" in str(course.get("instructionalStyle")):
                canBeAdded = False

            if "Studio Art" in str(course.get("instructionalStyle")):
                canBeAdded = False

            if "Practicum" in str(course.get("instructionalStyle")):
                canBeAdded = False

            if "Independent Study" in str(course.get("instructionalStyle")):
                canBeAdded = False

            if "Team Taught" in  str(course.get("instructionalStyle")):
                canBeAdded = False

            if canBeAdded:
                newCourseList.append(course)
        return newCourseList

    # if the student is a freshman, then they should not be taking any 3000 level class so they can be removed from the course list 

    # ideally, this function and remove 4000 courses should not do much because remove missing prereqs should bascially do the same thing.
    # These two can act as an extra level of insurance though 
    def remove2000Courses(self, course_list):

        newCourseList = []
        if self.status == "Freshman" or self.status == "First":
            for course in course_list:
                exemptCourse = False 

                # passing CS2 for digital arts and media so they can take it in their first year 
                if self.degree == "CS" or self.degree == "digitalArtsMedia":
                    if str(course.get("courseId")) == "2669":
                        exemptCourse = True
                if self.degree == "CS":
                    if str(course.get("courseId")) == "2712":
                        exemptCourse = True

                # Passing 2000+ courses for buisness so they can be taken in their first year
                if self.degree == "businessAdministration":
                    if str(course.get("courseId")) == "395":
                        exemptCourse = True
                if self.degree == "businessAdministration":
                    if str(course.get("courseId")) == "396":
                        exemptCourse = True
                if self.degree == "businessAdministration":
                    if str(course.get("courseId")) == "17":
                        exemptCourse = True
                if self.degree == "businessAdministration":
                    if str(course.get("courseId")) == "18":
                        exemptCourse = True

                #changed to string, it not string, gets error that it is not iterable
                if  "-2" not in str(course.get("courseName")) or exemptCourse:
                    newCourseList.append(course)
            return newCourseList

        else:
            return course_list



    # ideally, this function and remove 4000 courses should not do much because remove missing prereqs should bascially do the same thing.
    # These two can act as an extra level of insurance though 
    def remove3000Courses(self, course_list):

        newCourseList = []

        if self.status == "Freshman" or self.status == "Sophomore" or self.status == "First":

            for course in course_list:
                exemptCourse = False 

                # Passing exempt Courses for buisness major sophomore year
                if self.degree == "businessAdministration":
                        if str(course.get("courseId")) == "1643":
                            exemptCourse = True
                if self.degree == "businessAdministration":
                        if str(course.get("courseId")) == "1642":
                            exemptCourse = True

                #changed to string, it not string, gets error that it is not iterable
                if  "-3" not in str(course.get("courseName")) or exemptCourse:
                    newCourseList.append(course)
            return newCourseList

        else:
            return course_list

    # if the student is a freshman or a sophmore, then they should not be taking any 4000 level class they can be removed from the course list
    def remove4000Courses(self, course_list):

        newCourseList = []

        if self.status == "Freshman" or self.status == "Sophomore" or self.status == "First" or self.status == "Junior":

            for course in course_list:
                if  "-4" not in str(course.get("courseName")):
                    newCourseList.append(course)
            return newCourseList

        else:
            return course_list

    def removeOtherPrograms(self, course_list):

        implementedPrograms = ["CS", "BIO", "DART", "FREN", "BA", "ACCT", "ECON"]
        newCourseList = []

        # Making sure programs dont remove their own courses
        if self.degree == "digitalArtsMedia":
            implementedPrograms.remove("DART")
        elif self.degree == "french":
            implementedPrograms.remove("FREN")
        elif self.degree == "businessAdministration":
            implementedPrograms.remove("BA")
        else:
            implementedPrograms.remove(self.degree)

        programPreferences = self.program
        langPreferences = self.foreignLanguage

        for course in course_list:
            addCourse = True
            exemptCourse = False

            # Passing CS1 and CS2 for Dart 
            if self.degree == "digitalArtsMedia" and str(course.get("courseId")) == "2666":
                exemptCourse = True
            if self.degree == "digitalArtsMedia" and str(course.get("courseId")) == "2669":
                exemptCourse = True
            # Passing needed ACCT courses for Business
            if self.degree == "businessAdministration" and str(course.get("courseId")) == "17":
                exemptCourse = True
            if self.degree == "businessAdministration" and str(course.get("courseId")) == "18":
                exemptCourse = True
            if self.degree == "businessAdministration" and str(course.get("courseId")) == "26":
                exemptCourse = True
            # Passing needed ECON courses for Business
            if self.degree == "businessAdministration" and str(course.get("courseId")) == "395":
                exemptCourse = True
            if self.degree == "businessAdministration" and str(course.get("courseId")) == "396":
                exemptCourse = True
            if self.degree == "businessAdministration" and str(course.get("courseId")) == "1650":
                exemptCourse = True
            if self.degree == "businessAdministration" and str(course.get("courseId")) == "402":
                exemptCourse = True
            if self.degree == "businessAdministration" and str(course.get("courseId")) == "404":
                exemptCourse = True
            if self.degree == "businessAdministration" and str(course.get("courseId")) == "403":
                exemptCourse = True
            if self.degree == "businessAdministration" and str(course.get("courseId")) == "412":
                exemptCourse = True
            if self.degree == "businessAdministration" and str(course.get("courseId")) == "413":
                exemptCourse = True
            # Passing Courses if they are in your preferences
            if "Computer" in programPreferences and course.get("program") == "CS":
                exemptCourse = True
            if "Biology" in programPreferences and course.get("program") == "BIO":
                exemptCourse = True
            if "French" in programPreferences and course.get("program") == "FREN":
                exemptCourse = True
            if "French" == langPreferences and course.get("program") == "FREN":
                exemptCourse = True
            if "Business" in programPreferences and course.get("program") == "BA":
                exemptCourse = True
            if "Accounting" in programPreferences and course.get("program") == "ACCT":
                exemptCourse = True
            if "Economics" in programPreferences and course.get("program") == "ECON":
                exemptCourse = True

            if self.courseId != ['null']:

                #if the user has a certain course Id in their preferences make it exempt
                for newCourse in self.courseId:
                    if str(course.get("courseId")) == newCourse:
                        exemptCourse = True

            if course.get("program") in implementedPrograms or course in newCourseList:
                addCourse = False
            if addCourse or exemptCourse:
                newCourseList.append(course)

        return newCourseList

    def csp_backtracking(self):
        
        global set_solutions

        set_solutions = [] #List of available schedule which are consistent with all constraints

        credit_cnt = 0 #Number of credits

        possible_courses = csp.add_courses(self) #Possible courses which are only filtered by students profile so far.  

        csp.backtracking_hard_constraint(self, possible_courses, [], credit_cnt)
        return "done"


    def isgoal(self, credit, assignment):
        #print(assignment)

        required_program_courses = self.required_program_courses
        #Check whether the current assignment is our goal.
        # min_credit < assignment_credit < max_credit

        creditGoal = False

        #print(self.min_credit)
        #print(self.max_credit)
        #print(credit, "Number")
        if credit >= int(self.min_credit) and credit <= float(self.max_credit): 
            creditGoal = True

        degreeGoal = False

        #refers to both FYS and FYRS
        if self.status == "Freshman" or self.status == "First":
            FYS = False
        elif self.currentSemester == "May":
            FYS = True
        else:
            FYS = True

        #starts as true so if you put in a degree not in the system it will not crash
        required_courses_count = 0
        required_courses_in_schedule = 0
        #print(assignment)
        #need to check if requirement has been used
        filled_requirements = []

        for required_program_course in required_program_courses:
            for taken_course in self.course_taken_unit:
                #print(required_program_course.get("programName"))
                if self.degree in required_program_course.get("programName"):
                    #change to false so if the degree is in the system, it will check to see if it is correct
                    if self.track in required_program_course.get("trackName") or self.track == "null":
                        if self.status in required_program_course.get("status"):
                            #print(self.currentYear)
                            if self.currentYear in required_program_course.get("year") or required_program_course.get("year") == "All":
                                if self.currentSemester in required_program_course.get("semester"):
                                    if str(required_program_course.get("courseId")) == str(taken_course) or str(required_program_course.get("choiceCourses")) == str(taken_course) or str(required_program_course.get("choiceCourses2")) == str(taken_course):
                                        if required_program_course not in filled_requirements:
                                            required_courses_in_schedule = required_courses_in_schedule + 1
                                            filled_requirements.append(required_program_course)
                                                    
        for course in assignment:
            required_courses_count = 0 
            for required_program_course in required_program_courses:
                #print(required_program_course.get("programName"))
                if self.degree in required_program_course.get("programName"):
                    #change to false so if the degree is in the system, it will check to see if it is correct
                    if self.track in required_program_course.get("trackName") or self.track == "null":
                        if self.status in required_program_course.get("status"):
                            #print(self.currentYear)
                            if self.currentYear in required_program_course.get("year") or required_program_course.get("year") == "All":
                                if self.currentSemester in required_program_course.get("semester"):
                                    required_courses_count = required_courses_count + 1
                                    if str(required_program_course.get("courseId")) == str(course.get("courseId")) or str(required_program_course.get("choiceCourses")) == str(course.get("courseId")) or str(required_program_course.get("choiceCourses2")) == str(course.get("courseId")):
                                        if required_program_course not in filled_requirements: 
                                            #print("passed schedule")
                                            required_courses_in_schedule = required_courses_in_schedule + 1
                                            filled_requirements.append(required_program_course)
            if FYS == False:
                if self.currentSemester == "Fall":
                    #FYS
                    if "2076" in str(course.get("courseId")):
                        #print("this returns true")
                        FYS = True

                if self.currentSemester == "Winter":
                    #FYRS
                    if "2079" in str(course.get("courseId")):
                        FYS = True

                                #else:
                                    #degreeGoal = False

        if required_courses_in_schedule >= required_courses_count:
            degreeGoal = True
  
        #print("degreeGoal", degreeGoal)
        #print("creditGoal", creditGoal)
        #print("FYS", FYS)
        if degreeGoal == True and creditGoal == True and FYS == True:
            #print("return yes")
            return "Yes"
        elif self.degree == "null" and creditGoal == True and FYS == True:
            #print("return yes")
            return "Yes"
        else:
            #print("return no")
            return "No"
    def forwardchecking(self,current, possible_variables, credit):
        
        next_possible_variables = copy.deepcopy(possible_variables)

        next_credit = 0
        if current.get("credits") is not None:
            next_credit = credit + int(current.get("credits"))
        #index = 1

        # if current course plus another course is to many credits, remove course, 
        # also removes current course so it cant be added twice
        credit_limit = int(self.max_credit) - 0.25
        if credit >= credit_limit:
            return next_possible_variables
        else:

            ismorecredit = False
            issamecourse = False

            for course in possible_variables:

                if course.get("credits") is not None:
                    ismorecredit = next_credit + int(course.get("credits")) > float(self.max_credit) 
                    issamecourse = course.get("courseId") == current.get("courseId")

                if ismorecredit or issamecourse:
                    next_possible_variables.remove(course)
            return next_possible_variables


    def backtracking_hard_constraint(self, possible_variables, assignment, credit):

        schedule_score = 0

        # case 1, a potiential schedule will fail if it does not meet soft constraint thershold 
        if credit >= int(self.min_credit):
            
            #if self.instructionalStyle == ['null'] or self.courseId == ['null'] or self.program == ['null'] or self.foreignLanguage == ['null']:
#                thershold = 0
#            else:
#                thershold = 0
#
            for course in assignment:
                i = 0 
                while i < len(self.instructionalStyle):
                    if self.instructionalStyle[i] in str(course.get("instructionalStyle")):
                        schedule_score = schedule_score + (1 / len(assignment))
                    i += 1

                i = 0 
                while i < len(self.program):
                    if self.program[i] in str(course.get("program")):
                       schedule_score = schedule_score + 1
                    i += 1

                i = 0 
                while i < len(self.courseId):
                    if str(self.courseId[i]) in str(course.get("courseId")):
                       schedule_score = schedule_score + 2
                    i += 1

                if self.foreignLanguage in str(course.get("courseName")):
                   schedule_score = schedule_score + 1

                i = 0 
                while i < len(self.negativeCourseId):
                    if str(self.negativeCourseId[i]) in str(course.get("courseId")):
                        schedule_score = schedule_score - 2
                    i += 1

                i = 0 
                # "ECON" works, "economics" does not work. However, "economics" is the format of the website
                while i < len(self.negativeProgram):
                    currentProgram = self.negativeProgram[i]
                    if course.get("program").lower() in currentProgram.lower():
                        schedule_score = schedule_score - 2
                    i += 1

                # Making health and wellness show up earlier, making spanish courses show up earlier, 
                # but making spanish three show up less likely
                if course.get("courseRepresentation") == "1L":
                    schedule_score = schedule_score + 1
                if str(course.get("courseId")) == "2584":
                    schedule_score = schedule_score + 1
                if str(course.get("courseId")) == "1405":
                    schedule_score = schedule_score - 1

           #print(schedule_score)
          #  if schedule_score < thershold:
               #return "failure"
            #else:
                course["score"] = str(schedule_score)

        # case 2, a potiential schedule will fail if it is too similar to other schedules in set_solutions
        # to be checked for this case, assignment must have a length of at least 4 and (length - 1) must be the same

        # in my testing, performance is about the same but the solution size is significantly smaller, we should leave this commented out until
        # we can get it running for all four years and then uncomment it when speed is no longer a problem and we want increased variety in the schedules 

 #       if len(assignment) >= 4:
 #           courseIds = []
 #           same_schedule_threshold = (len(assignment) - 1)

#  #          # if set_solutions is empty, set tooSimilar to false so the first potiential schedule can pass
 #           if len(set_solutions) == 0:
 #               tooSimilar = False
 #           else:
 #               tooSimilar = True

#  #          # compare courseId's and schedule same_schedule_thersold number of times, if there are equal every time, fail
 #           for item in assignment:
 #               courseIds.append(item.get("courseId"))
 #           for schedule in set_solutions:
 #               if len(schedule[0]) >= same_schedule_threshold:
 #                   for i in range(same_schedule_threshold):
 #                       if courseIds[i] != schedule[0][i][0]:
 #                           tooSimilar = False
 #                           break 
 #               if not tooSimilar:
 #                   break
 #           if tooSimilar == True:
 #               return "failure"

#        # a potiential schedule will be added to the set_solutions if it meets the credit requirement goals
        if csp.isgoal(self,credit, assignment) == "Yes":

            new = []
        
            for course in assignment: 

                new.append((course.get("courseId"), course.get("courseName"), course.get("courseTitle"), course.get("courseRepresentation")))

            set_solutions.append((new, schedule_score)) 

        # Checking if the course list is empty
        if possible_variables == []:
            return "failure"

        # Building up a potiential schedule
        else:

            for current in possible_variables:

                x = csp.forwardchecking(self, current, possible_variables, credit)

                if assignment == []:          
                    assignment.append(current)
                    if current.get("credits") is not None:
                        credit += int(current.get("credits"))
                    result = csp.backtracking_hard_constraint(self, x, assignment, credit)
                    if result != "failure":
                        return result
                else:

                    # checking if the current course is greater than the last course
                    #if 5 > 4:
                    if current.get("courseId") > assignment[-1].get("courseId"):
                        assignment.append(current)
                        if current.get("credits") is not None:
                            credit += int(current.get("credits"))
                        result = csp.backtracking_hard_constraint(self, x, assignment, credit)
                        if result != "failure":
                            return result

                if current in assignment:
                    assignment.remove(current)
                    if current.get("credits") is not None:
                        credit -= int(current.get("credits"))

        return "failure"

    #The entire set of solutions(Raw version)
    # [[{course data}, {course data}] , [{course data}, {course data}, {course data}]........]
    #   -----------------------------   =============================================
    def hard_constraint_solutions(self, filename):
        print(" hard constarints profile name")
        print("filename")
        print("SOLUTION SIZE:",  len(set_solutions), "\n")
        
        # clearing out files
        #file = open("output1.txt", "w")
        #file.close()
        #file = open("outputId.txt", "w")

        # Do we need the outputId file at all?
        #idFile = self.username +"Id.txt"
        #idOutput = open(idFile, "w")

        if len(set_solutions) == 0:
            print('>>>')

            # removing a file and recreating it if it is locked by the website
            if os.path.exists(self.username + "NewProfile.txt"):
                os.remove(self.username + "NewProfile.txt") 
#
 #           # removing a file and recreating it if it is locked by the website
            if os.path.exists(self.username + ".txt"):
                os.remove(self.username + ".txt") 
#
            if filename == self.username + "Profile1":
                outputfile = self.username +".txt"
                schedule = open(outputfile, "w")
                schedule.write("Error: Cannot Generate Schedule" + "\n")
            elif filename == self.username + "NewProfile":
                outputfile = self.username +".txt"
                schedule = open(outputfile, "a")
                schedule.write("Error: Cannot Generate Schedule" + "\n")

        #file.close()

        # getting one optimal schedule not in a loop and writing it to newProfile
        index = 0
        optimalIndex = 0
        highestScore = 0 
        for schedule in set_solutions:
            if highestScore < schedule[1]:
                highestScore = schedule[1]
                optimalIndex = index
            index += 1 

        # 1st case, this is the first time it is called in the script, read in data from orginal profile
        # and send it to newProfile 
        if filename == self.username + "Profile1" and set_solutions:
        #if "1" in filename and set_solutions:
            print("^")

            # removing a file and recreating it if it is locked by the website
            if os.path.exists(self.username + "NewProfile.txt"):
                os.remove(self.username + "NewProfile.txt") 

            # removing a file and recreating it if it is locked by the website
            if os.path.exists(self.username + ".txt"):
                os.remove(self.username + ".txt") 

            newProfile = open(self.username + "NewProfile.txt", "w")
            oldProfile = open(self.username + "Profile1.txt", "r")

            found_course_taken_unit = False
            found_semester = False
            found_degree_status = False
            found_year = False

            print(str(set_solutions[optimalIndex][0][1][2]))

            for line in oldProfile:
                write_line = True

                # modifying status between semesters
                if found_degree_status:
                    if self.currentSemester == "May":

                        if self.status == "Freshman" or self.status == "First": 
                            newProfile.write("Sophomore" + "\n")
                        if self.status == "Sophomore":
                            newProfile.write("Junior" + "\n")
                        if self.status == "Junior":
                            newProfile.write("Senior" + "\n")
                        if self.status == "Senior":
                            newProfile.write("Senior" + "\n")
                        found_degree_status = False
                        write_line = False 

                # adding optional schedule course id's to course taken list
                if found_course_taken_unit and line.strip() == "":
                    found_course_taken_unit = False
                    solution_index = 0
                    while solution_index <  len(set_solutions[optimalIndex][0]):
                        newProfile.write(str(set_solutions[optimalIndex][0][solution_index][0]) + "\n")
                        solution_index = solution_index + 1

                # modifying semesters between semesters 
                if found_semester:
                    found_semester = False
                    write_line = False
                    print("current Semester")
                    print(self.currentSemester)

                    if self.currentSemester == "Fall":
                        newProfile.write("Winter" + "\n")

                    if self.currentSemester == "Winter":
                        newProfile.write("May" + "\n")

                    if self.currentSemester == "May":
                        newProfile.write("Fall" + "\n")

                # modifying year between semesters
                if found_year:
                    if self.currentSemester == "May":

                        if self.currentYear == "Even": 
                            newProfile.write("Odd" + "\n")
                        if self.currentYear == "Odd":
                            newProfile.write("Even" + "\n")
                        found_year = False
                        write_line = False        

                if "#course_taken_unit" in line:
                    found_course_taken_unit = True

                if "#currentSemester" in line:
                    found_semester = True

                if "#degree_status" in line:
                    found_degree_status = True

                if "currentYear" in line:
                    found_year = True

                if write_line == True:
                    newProfile.write(line)

            print("TEST", set_solutions[optimalIndex][0])

            newProfile.close()
            oldProfile.close()

            #set_solutions.remove(set_solutions[optimalIndex])

            if csp.progress_check(self, self.username + "NewProfile", set_solutions[optimalIndex][0]) == False:

                print("boom")
                set_solutions.remove(set_solutions[optimalIndex])
                csp.hard_constraint_solutions(self, self.username + "Profile1")
                # Replace newProfile with temp file
                #os.replace("temp.txt", "newProfile.txt")
            else:
                print("else for profile 1")
                #schedule = open("output.txt", "w")
                outputfile = self.username +".txt"
                schedule = open(outputfile, "w")

                if self.status == "Freshman" or self.status == "First":
                    schedule.write("First-year"+ " ")
                else:
                    schedule.write(self.status + " ")
                schedule.write(self.currentSemester + "\n")

                solution_index = 0
                while solution_index <  len(set_solutions[optimalIndex][0]):
                    schedule.write(str(set_solutions[optimalIndex][0][solution_index][1]) + "\n")
                    solution_index = solution_index + 1
                #schedule.write("\n")

        # 2nd case, every other time it is called in the script, read in data from newProfile
        # and also send it to newProfile
        elif filename == self.username + "NewProfile" and set_solutions:
            print("hit new profile")

            # removing a file and recreating it if it is locked by the website
            if os.path.exists(self.username + "temp.txt"):
                os.remove(self.username + "temp.txt") 
             
            temp_file = open(self.username + "temp.txt", "w")
            newProfile = open(self.username + "NewProfile.txt", "r")
            found_course_taken_unit = False
            found_semester = False
            found_degree_status = False
            found_year = False

            for line in newProfile:
                write_line = True

                # modifying status between semesters
                if found_degree_status:
                    if self.currentSemester == "May":

                        if self.status == "Freshman" or self.status == "First": 
                            temp_file.write("Sophomore" + "\n")
                        if self.status == "Sophomore":
                            temp_file.write("Junior" + "\n")
                        if self.status == "Junior":
                            temp_file.write("Senior" + "\n")
                        if self.status == "Senior":
                            temp_file.write("Senior" + "\n")
                        found_degree_status = False
                        write_line = False 

                # adding optional schedule course id's to course taken list
                if found_course_taken_unit and line.strip() == "":
                    found_course_taken_unit = False
                    solution_index = 0
                    while solution_index <  len(set_solutions[optimalIndex][0]):
                        temp_file.write(str(set_solutions[optimalIndex][0][solution_index][0]) + "\n")
                        solution_index = solution_index + 1

                # modifying semesters between semesters 
                if found_semester:
                    found_semester = False
                    write_line = False
                    print("current Semester")
                    print(self.currentSemester)

                    if self.currentSemester == "Fall":
                        temp_file.write("Winter" + "\n")

                    if self.currentSemester == "Winter":
                        temp_file.write("May" + "\n")

                    if self.currentSemester == "May":
                        temp_file.write("Fall" + "\n")

                # modifying year between semesters
                if found_year:
                    if self.currentSemester == "May":

                        if self.currentYear == "Even": 
                            temp_file.write("Odd" + "\n")
                        if self.currentYear == "Odd":
                            temp_file.write("Even" + "\n")
                        found_year = False
                        write_line = False        

                if "#course_taken_unit" in line:
                    found_course_taken_unit = True

                if "#currentSemester" in line:
                    found_semester = True

                if "#degree_status" in line:
                    found_degree_status = True

                if "currentYear" in line:
                    found_year = True

                if write_line == True:
                    temp_file.write(line)

            #set_solutions.remove(set_solutions[optimalIndex])

            newProfile.close()
            temp_file.close()

                #schedule.write("ERROR: NO Possible Solutions" + "\n")

            if csp.progress_check(self, "temp", set_solutions[optimalIndex][0]) == True:
                print("Passed progress check!")
                # Replace newProfile with temp file
                os.replace(self.username + "temp.txt", self.username + "NewProfile.txt")

                #schedule = open("output.txt", "a")
                outputfile = self.username +".txt"
                schedule = open(outputfile, "a")

                print("WRITING TO OUTPUT")
                if self.status == "Freshman" or self.status == "First":
                    schedule.write("First-year"+ " ")
                else:
                    schedule.write(self.status + " ")
                schedule.write(self.currentSemester + "\n")

                solution_index = 0
                while solution_index <  len(set_solutions[optimalIndex][0]):
                    schedule.write(str(set_solutions[optimalIndex][0][solution_index][1]) + "\n")
                    solution_index = solution_index + 1
                #schedule.write("\n")

                if self.status == "Senior" and self.currentSemester == "May":

                    print("Writing schedule to the database...")

                    schedule = open(self.username + ".txt", "r")

                    firstYearFallFound = False
                    firstYearWinterFound = False
                    firstYearMayFound = False
                    sophomoreFallFound = False
                    sophomoreWinterFound = False
                    sophomoreMayFound = False
                    juniorFallFound = False
                    juniorWinterFound = False
                    juniorMayFound = False
                    seniorFallFound = False
                    seniorWinterFound = False
                    seniorMayFound = False

                    firstYearFall = ""
                    firstYearWinter = ""
                    firstYearMay = ""
                    sophomoreFall = ""
                    sophomoreWinter = ""
                    sophomoreMay = ""
                    juniorFall = ""
                    juniorWinter = ""
                    juniorMay = ""
                    seniorFall = ""
                    seniorWinter = ""
                    seniorMay = ""


                    for line in schedule:

                        if firstYearFallFound == True and "First-year Winter" not in line:
                            print(line)
                            firstYearFall = firstYearFall + line + ", "

                        if firstYearWinterFound == True and "First-year May" not in line:
                            print(line)
                            firstYearWinter = firstYearWinter + line + ", "

                        if firstYearMayFound == True and "Sophomore Fall" not in line:
                            print(line)
                            firstYearMay = firstYearMay + line + ", "

                        if sophomoreFallFound == True and "Sophomore Winter" not in line:
                            print(line)
                            sophomoreFall = sophomoreFall + line + ", "

                        if sophomoreWinterFound == True and "Sophomore May" not in line:
                            print(line)
                            sophomoreWinter = sophomoreWinter + line + ", "

                        if sophomoreMayFound == True and "Junior Fall" not in line:
                            print(line)
                            sophomoreMay = sophomoreMay + line + ", "

                        if juniorFallFound == True and "Junior Winter" not in line:
                            print(line)
                            juniorFall = juniorFall + line + ", "

                        if juniorWinterFound == True and "Junior May" not in line:
                            print(line)
                            juniorWinter = juniorWinter + line + ", "

                        if juniorMayFound == True and "Senior Fall" not in line:
                            print(line)
                            juniorMay = juniorMay + line + ", "

                        if seniorFallFound == True and "Senior Winter" not in line:
                            if line == " ":
                                print("blank line")
                            print(line)
                            seniorFall = seniorFall + line + ", "

                        if seniorWinterFound == True and "Senior May" not in line:
                            print(line)
                            seniorWinter = seniorWinter + line + ", "

                        if seniorMayFound == True:
                            print(line)
                            seniorMay = seniorMay + line + ", "



                        if "First-year Fall" in line:
                            print("First-year Fall")
                            firstYearFallFound = True
                            firstYearWinterFound = False
                            firstYearMayFound = False
                            sophomoreFallFound = False
                            sophomoreWinterFound = False
                            sophomoreMayFound = False
                            juniorFallFound = False
                            juniorWinterFound = False
                            juniorMayFound = False
                            seniorFallFound = False
                            seniorWinterFound = False
                            seniorMayFound = False

                        if "First-year Winter" in line:
                            print("First-year Winter")
                            firstYearFallFound = False
                            firstYearWinterFound = True
                            firstYearMayFound = False
                            sophomoreFallFound = False
                            sophomoreWinterFound = False
                            sophomoreMayFound = False
                            juniorFallFound = False
                            juniorWinterFound = False
                            juniorMayFound = False
                            seniorFallFound = False
                            seniorWinterFound = False
                            seniorMayFound = False

                        if "First-year May" in line:
                            print("First-year May")
                            firstYearFallFound = False
                            firstYearWinterFound = False
                            firstYearMayFound = True
                            sophomoreFallFound = False
                            sophomoreWinterFound = False
                            sophomoreMayFound = False
                            juniorFallFound = False
                            juniorWinterFound = False
                            juniorMayFound = False
                            seniorFallFound = False
                            seniorWinterFound = False
                            seniorMayFound = False

                        if "Sophomore Fall" in line:
                            print("Sophomore Fall")
                            firstYearFallFound = False
                            firstYearWinterFound = False
                            firstYearMayFound = False
                            sophomoreFallFound = True
                            sophomoreWinterFound = False
                            sophomoreMayFound = False
                            juniorFallFound = False
                            juniorWinterFound = False
                            juniorMayFound = False
                            seniorFallFound = False
                            seniorWinterFound = False
                            seniorMayFound = False

                        if "Sophomore Winter" in line:
                            print("Sophomore Winter")
                            firstYearFallFound = False
                            firstYearWinterFound = False
                            firstYearMayFound = False
                            sophomoreFallFound = False
                            sophomoreWinterFound = True
                            sophomoreMayFound = False
                            juniorFallFound = False
                            juniorWinterFound = False
                            juniorMayFound = False
                            seniorFallFound = False
                            seniorWinterFound = False
                            seniorMayFound = False

                        if "Sophomore May" in line:
                            print("Sophomore May")
                            firstYearFallFound = False
                            firstYearWinterFound = False
                            firstYearMayFound = False
                            sophomoreFallFound = False
                            sophomoreWinterFound = False
                            sophomoreMayFound = True
                            juniorFallFound = False
                            juniorWinterFound = False
                            juniorMayFound = False
                            seniorFallFound = False
                            seniorWinterFound = False
                            seniorMayFound = False

                        if "Junior Fall" in line:
                            print("Junior Fall")
                            firstYearFallFound = False
                            firstYearWinterFound = False
                            firstYearMayFound = False
                            sophomoreFallFound = False
                            sophomoreWinterFound = False
                            sophomoreMayFound = False
                            juniorFallFound = True
                            juniorWinterFound = False
                            juniorMayFound = False
                            seniorFallFound = False
                            seniorWinterFound = False
                            seniorMayFound = False

                        if "Junior Winter" in line:
                            print("Junior Winter")
                            firstYearFallFound = False
                            firstYearWinterFound = False
                            firstYearMayFound = False
                            sophomoreFallFound = False
                            sophomoreWinterFound = False
                            sophomoreMayFound = False
                            juniorFallFound = False
                            juniorWinterFound = True
                            juniorMayFound = False
                            seniorFallFound = False
                            seniorWinterFound = False
                            seniorMayFound = False

                        if "Junior May" in line:
                            print("Junior May")
                            firstYearFallFound = False
                            firstYearWinterFound = False
                            firstYearMayFound = False
                            sophomoreFallFound = False
                            sophomoreWinterFound = False
                            sophomoreMayFound = False
                            juniorFallFound = False
                            juniorWinterFound = False
                            juniorMayFound = True
                            seniorFallFound = False
                            seniorWinterFound = False
                            seniorMayFound = False

                        if "Senior Fall" in line:
                            print("Senior Fall")
                            firstYearFallFound = False
                            firstYearWinterFound = False
                            firstYearMayFound = False
                            sophomoreFallFound = False
                            sophomoreWinterFound = False
                            sophomoreMayFound = False
                            juniorFallFound = False
                            juniorWinterFound = False
                            juniorMayFound = False
                            seniorFallFound = True
                            seniorWinterFound = False
                            seniorMayFound = False

                        if "Senior Winter" in line:
                            print("Senior Winter")
                            firstYearFallFound = False
                            firstYearWinterFound = False
                            firstYearMayFound = False
                            sophomoreFallFound = False
                            sophomoreWinterFound = False
                            sophomoreMayFound = False
                            juniorFallFound = False
                            juniorWinterFound = False
                            juniorMayFound = False
                            seniorFallFound = False
                            seniorWinterFound = True
                            seniorMayFound = False

                        if "Senior May" in line:
                            print("Senior May")
                            firstYearFallFound = False
                            firstYearWinterFound = False
                            firstYearMayFound = False
                            sophomoreFallFound = False
                            sophomoreWinterFound = False
                            sophomoreMayFound = False
                            juniorFallFound = False
                            juniorWinterFound = False
                            juniorMayFound = False
                            seniorFallFound = False
                            seniorWinterFound = False
                            seniorMayFound = True

                    #print("First year fall courses:")
                    #print(firstYearFall)

                    try:
                        connection = mysql.connector.connect(
                            host="10.20.3.4",
                            user='dbms_tusa',
                            password='falldogumbrellashirt24',
                            database='tusa_db'
                        )

                        if connection.is_connected():
                            print("Connected to tusa_db")
                            print("trying to insert into db")

                            cursor = connection.cursor()
                            cursor.execute("""Insert into StudentSchedule (userName, freshmanFall, freshmanWinter, freshmanMay, sophomoreFall, sophomoreWinter, sophomoreMay, juniorFall, juniorWinter, juniorMay, seniorFall, seniorWinter, seniorMay) values (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""", (self.username, firstYearFall, firstYearWinter, firstYearMay, sophomoreFall, sophomoreWinter, sophomoreMay, juniorFall, juniorWinter, juniorMay, seniorFall, seniorWinter, seniorMay,))
                            connection.commit()
                    except Error as e:
                        print("Error: ", e)

                    finally:
                        if connection.is_connected():
                            connection.close()
                            print("Connection closed")
                        
                    
            else:
                print("Failed Progress Check")
                set_solutions.remove(set_solutions[optimalIndex])
                csp.hard_constraint_solutions(self, self.username + "NewProfile")
                #set_solutions.remove(set_solutions[optimalIndex])





    def may_schedule(self):
        print("Scheduling for may")
        
        global set_solutions

        set_solutions = [] #List of available schedule which are consistent with all constraints

        credit_cnt = 0 #Number of credits

        possible_courses = csp.add_courses(self) #Possible courses which are only filtered by students profile so far.

        #print("possible courses")
        #print(possible_courses)

        for course in possible_courses:
            schedule_score = 0
            new = []
            #print ("printing ")
            #print(course.get("courseId"))
            i = 0
            while i < len(self.instructionalStyle):
                if self.instructionalStyle[i] in course.get("instructionalStyle"):
                    schedule_score = schedule_score + 1
                i += 1

            i = 0
            while i < len(self.program):
                if self.program[i] in course.get("program"):
                    schedule_score = schedule_score + 1
                i += 1

            i = 0
            while i < len(self.courseId):
                if str(self.courseId[i]) in str(course.get("courseId")):
                    schedule_score = schedule_score + 1
                i += 1

            if self.foreignLanguage in course.get("courseName"):
                   schedule_score = schedule_score + 1

            i = 0 
            while i < len(self.negativeCourseId):
                if str(self.negativeCourseId[i]) in str(course.get("courseId")):
                    schedule_score = schedule_score - 2
                i += 1

            i = 0 
            # "ECON" works, "economics" does not work. However, "economics" is the format of the website
            while i < len(self.negativeProgram):
                currentProgram = self.negativeProgram[i]
                if course.get("program").lower() in currentProgram.lower():
                    schedule_score = schedule_score - 2
                i += 1

            # Making health and wellness show up earlier, making spanish courses show up earlier, 
            # but making spanish three show up less likely
            if course.get("courseRepresentation") == "1L":
                schedule_score = schedule_score + 1
            if str(course.get("courseId")) == "2584":
                schedule_score = schedule_score + 1
            if str(course.get("courseId")) == "1405":
                schedule_score = schedule_score - 1

           #print(schedule_score)
            new.append((course.get("courseId"), course.get("courseName"), course.get("courseTitle"), course.get("courseRepresentation")))
            set_solutions.append((new, schedule_score, "None"))

    def progress_check(self, filename, solutions):
        print("In Progress Check")

        #file = open("newProfile.txt", "r")
        if filename == "temp":
            file = open(self.username + filename + ".txt", "r")
        else:
            file = open(filename + ".txt", "r")

        courseList = []
        for solution in solutions:
            for course in self.course_list:
                if course.get("courseName") == solution[1]:
                    courseList.append(course)

        for taken in self.course_taken_unit:
            for course in self.course_list:
                if str(course.get("courseId")) == taken:
                    courseList.append(course)

        #foundCourse = " "

        #print(course_list)

        #degreerequirements
        FYS = "not found"
        FYRS = "not found"
        health = "not found"
        math = "not found"
        FL1 = "not found"
        FL2 = "not found"
        humanities = "not found"
        art = "not found"
        natural_science = "not found"
        social_science = "not found"
        non_western = "not found"
        western = "not found"
        #both sets must be out of major
        set1_course1 = "not found"
        set1_course2 = "not found"
        #outside devison of natural science and math
        set2_course1 = "not found"
        set2_course2 = "not found"
        #outside major
        writing1 = "not found"
        writing2 = "not found"
        electives = 0
        #3 types of bio electives, must have 3 electives from each catagory 
        bioElective = 0
        bioAboveElective = 0
        bioScienceElective = 0
        # Need one of each category
        dartAbove = 0
        dartbelow = 0
        # Need to take 4 
        frenchElectives = 0

        progress_score = 0

        course_used = " "

        find_purpose = False
        found_course = False

        #to prevent a course from being counted for multiple elctives 
        used_elective_course_ids = [] 

        #will add required courses and electives

        found_course_taken_unit = False
        for line in file:

            if "#course_taken_unit" == line:
                found_course_taken_unit = True

            if line.strip() == "":
                found_course_taken_unit = False

            if "#course_request_unit" == line:
                found_course_taken_unit = False

            #if found_course_taken_unit:
                #print(line)
            
            if found_course_taken_unit:

                for course in courseList:
                    #print("compare")
                    #print(line)
                    #print(course.get("courseId"))
                    #may cuase issues later

                    #not working! if the line is 2658, it will let 265 pass
                    #print(course.get("courseId"))
#                    print(str(course.get("courseId")))
#                    print(line)
#                    print("#####")
#                    print(type(line))
#                    print(type(course.get("courseId")))
#                    print(type(str(course.get("courseId"))))
#                    print(type(int(line)))
                    if course.get("courseId") == int(line):
                        #print(course.get("courseId"))
                        #print("found")
                        found_course = True
                        find_purpose = True
                        foundCourse = course
                        print("found course:")
                        print(foundCourse.get("courseName"))
                        course_used = False
                        course_purpose = foundCourse.get("courseRepresentation")    
                        print(course_purpose) 
                        break
                if found_course == True:
                    print("worked")
                    #print(foundCourse.get("courseName"))
                    #print(foundCourse.get("courseId"))

                    for elective in self.electives:
                        #print("comparing")
                        #print(elective.get("courseId"))
                        #print(foundCourse.get("courseId"))
                        #print("\n")

                        if str(elective.get("courseId")) == str(foundCourse.get("courseId")):
                            print("found course is elective")
                            print(elective)
                            print("found electives")
                            print(used_elective_course_ids)
                            if elective.get("programName") in self.degree:
                                if self.track == elective.get("trackName") or self.track == "null":
                                    #if str(elective.get("courseId")) in str(foundCourse.get("courseId")):
                                    print("elective course Id:")
                                    print(str(elective.get("courseId")))
                                    if str(elective.get("courseId")) not in used_elective_course_ids:
                                        electives = electives + 1
                                        print("elective matches:")
                                        print(foundCourse.get("courseName"))
                                        print("\n")
                                        if self.degree == "BIO":
                                            if elective.get("electiveType") == "3000 above" and bioAboveElective < 4:
                                                bioAboveElective = bioAboveElective + 1
                                                print("bioAboveElective:")
                                                print(foundCourse)
                                                used_elective_course_ids.append(str(elective.get("courseId")))
                                            elif elective.get("electiveType") == "bio" and bioElective < 4:
                                                bioElective = bioElective + 1
                                                print("bioElective:")
                                                print(foundCourse)
                                                used_elective_course_ids.append(str(elective.get("courseId")))
                                            elif elective.get("electiveType") == "science" and bioScienceElective < 4:
                                                print("bioScienceElective:")
                                                print(foundCourse)
                                                bioScienceElective = bioScienceElective + 1
                                                used_elective_course_ids.append(str(elective.get("courseId")))
                                        if self.degree == "digitalArtsMedia":
                                            if elective.get("electiveType") == "2000 above":
                                                dartAbove = dartAbove + 1
                                                print("dartAboveElective:")
                                                print(foundCourse)
                                                used_elective_course_ids.append(str(elective.get("courseId")))
                                            if elective.get("electiveType") == "2000 under":
                                                dartbelow = dartbelow + 1
                                                print("dartBelowElective:")
                                                print(foundCourse)
                                                used_elective_course_ids.append(str(elective.get("courseId")))
                                        if self.degree == "french":
                                            if elective.get("electiveType") == "French":
                                                frenchElectives = frenchElectives + 1
                                                print("frenchElectives:")
                                                print(foundCourse)
                                                used_elective_course_ids.append(str(elective.get("courseId")))

                if find_purpose == True:
                    
                    if course_purpose is not None and "1F" in course_purpose:
                        if str(foundCourse.get("courseId")) == "2076":
                            FYS = foundCourse
                            course_used = True  

                        if str(foundCourse.get("courseId")) == "2079":
                            FYRS = foundCourse
                            course_used = True  

                    if course_purpose is not None and "1PE" in course_purpose:

                        #print("#####")
                        #print(str(foundCourse.get("courseId")))
                        #Health and exercise science
                        if str(foundCourse.get("courseId")) == "2584":
                            health = foundCourse
                            course_used = True  

                    #math
                    if course_purpose is not None and "1M" in course_purpose:

                        # CS should always have calc 1 as a math gen ed 
                        if self.degree == "CS":
                            if str(foundCourse.get("courseId")) == "2670":
                                math = foundCourse 
                                course_used = True
                        #math-1304
                        elif str(foundCourse.get("courseId")) == "2670":
                            math = foundCourse
                            course_used = True
                        #math-1144
                        elif str(foundCourse.get("courseId")) == "772":
                            math = foundCourse
                            course_used = True
                        #math
                        elif str(foundCourse.get("courseId")) == "768":
                            math = foundCourse
                            course_used = True
                        #math-1324
                        elif str(foundCourse.get("courseId")) == "2671":
                            math = foundCourse
                            course_used = True  
    
                    #purposely does not have an order for languages so a student could take 1&2 of a
                    #language or 2&3
                    if course_purpose is not None and "1L" in course_purpose:
                        if course_used == False:
                            if FL1 == "not found":
                                FL1 = foundCourse
                                course_used = False
                            elif FL1 != "not found":
                                if FL2 == "not found":
                                    if FL1.get("program") in foundCourse.get("program"):
                                        FL2 = foundCourse
                                        course_used = False 

                    if course_purpose is not None and "2H" in course_purpose:
                        if course_used == False:
                            humanities = foundCourse
                            #if "2H3A" not in course_purpose:
                            course_used = True  

                    if course_purpose is not None and "2FA" in course_purpose:
                        if course_used == False:

                            if self.degree == "digitalArtsMedia":
                                if course.get("program") != "digitalArtsMedia":
                                    art = foundCourse
                                    course_used = True 
                            else:
                                art = foundCourse
                                #if "2FA4" not in course_purpose:
                                course_used = True  

                    if course_purpose is not None and "2NS" in course_purpose:
                        if course_used == False:

                            if self.degree == "CS":
                                if course.get("program") != "CS":
                                    natural_science = foundCourse
                                    course_used = True 
                            elif self.degree == "BIO":
                                if course.get("program") != "BIO":
                                    natural_science = foundCourse
                                    course_used = True 
                            else:
                                natural_science = foundCourse
                                #if "2NS4" == course_purpose: 
                                course_used = True

                    if course_purpose is not None and "2SS" in course_purpose:
                        if course_used == False:
                            social_science = foundCourse
                            if "2SS4" not in course_purpose:
                                course_used = True      

                    if course_purpose is not None and "3N" in course_purpose:
                        if course_used == False:
                            non_western = foundCourse
                            if course_purpose != "3N4" and course_purpose != "3N4W":
                                course_used = True
                            else:

                                # this course is also upper level liberal arts or writing, need to check if they are already filled

                                if "3N4" == course_purpose:
                                    # checking if the upper level liberal arts courses are filled 
                                    if set2_course1 != "not found" and set2_course2 != "not found":
                                        if self.degree not in foundCourse.get("program"):
                                            if "2NS" not in course_purpose and "1M" not in course_purpose:
                                                if set1_course1 != "not found" and set1_course2 != "not found":
                                                    course_used = True 

                                if "3N4W" == course_purpose:
                                    #checking if both writing courses are filled 
                                    if writing1 != "not found" and writing2 != "not found":
                                        course_used = True 

                    if course_purpose is not None and "3W" in course_purpose:
                        if course_used == False:
                            western = foundCourse
                            if "3W4" not in course_purpose:
                                course_used = True  

                    # 2 sets of 4
                    # one set can not be in students major, must exclude Mathematics, and Natural Science
                    # the other set must be outside the major but can be in the same department
                    if course_purpose is not None and "4" in course_purpose:
                        if course_used == False:

                            if self.degree == "digitalArtsMedia" and str(foundCourse.get("courseId")) == "2669":
                                course_used = False
                            else:
                                    #print("Test",foundCourse.get("program"))
                                    if self.degree not in foundCourse.get("program"):

                                        # not in major and not in department 
                                        if "2NS" not in course_purpose and "1M" not in course_purpose:
                                            if set1_course1 == "not found":
                                                if  set2_course1 == "not found" or set2_course1.get("program") not in set1_course1.get("program") :
                                                    set1_course1 = foundCourse
                                                    if "4" == course_purpose:
                                                        course_used = True
                                            elif set1_course2 == "not found":
                                                #if  set2_course1 == "not found" or set2_course1.get("program") not in set1_course1.get("program") :
                                                    if set1_course1.get("program") in foundCourse.get("program"):
                                                        if foundCourse != set1_course1:
                                                            set1_course2 = foundCourse
                                                            if "4" == course_purpose or "4W" == course_purpose:
                                                                course_used = True   

                                        # not in major
                                        if set2_course1 == "not found" and course_used == False:

                                            if set1_course1.get("program") not in foundCourse.get("program"):

                                                set2_course1 = foundCourse
                                                if "4" == course_purpose:
                                                    course_used = True
                                        elif set2_course2 == "not found" and course_used == False:

                                            if set1_course2 == "not found" or set1_course2.get("program") not in foundCourse.get("program"):

                                                if set2_course1.get("program") in foundCourse.get("program"):
                                                    if foundCourse != set2_course1:
                                                        set2_course2 = foundCourse
                                                    if "4" == course_purpose:
                                                        course_used = True  
        
                    if course_purpose is not None and "4W" in course_purpose:
                        if course_used == False:
                            #you must complete two writing intensives OUTSIDE your primary major
                            if self.degree not in foundCourse.get("program"):
                                if writing1 == "not found":
                                    writing1 = foundCourse
                                    course_used = True  

                                elif writing2 == "not found":
                                    writing2 = foundCourse
                                    course_used = True  

                    #print(foundCourse)

            if "#course_taken_unit" in line:
                found_course_taken_unit = True

            if line.strip() == "":
                found_course_taken_unit = False

            if "#course_request_unit" in line:
                found_course_taken_unit = False

        if FYS != "not found":
           progress_score = progress_score + 1
            
        if FYRS != "not found":
            progress_score = progress_score + 1

        if health != "not found":
            progress_score = progress_score + 1

        if math != "not found":
            progress_score = progress_score + 1

        if FL1 != "not found":
            progress_score = progress_score + 1

        if FL2 != "not found":
            progress_score = progress_score + 1

        if humanities != "not found":
            progress_score = progress_score + 1

        if art != "not found":
            progress_score = progress_score + 1    

        if natural_science != "not found":
            progress_score = progress_score + 1 


        if social_science != "not found":
            progress_score = progress_score + 1 


        if non_western != "not found":
            progress_score = progress_score + 1 


        if western != "not found":
            progress_score = progress_score + 1


        if set1_course1 != "not found":
            progress_score = progress_score + 1


        if set1_course2 != "not found":
            progress_score = progress_score + 1


        if set2_course1 != "not found":
            progress_score = progress_score + 1


        if set2_course2 != "not found":
            progress_score = progress_score + 1                                                


        if writing1 != "not found":
            progress_score = progress_score + 1                                                


        if writing2 != "not found":
            progress_score = progress_score + 1                                                

        print("FYS:")
        print(FYS)
        print("\n")

        print("FYRS:")
        print(FYRS)
        print("\n")

        print("health:")
        print(health)
        print("\n")

        print("math:")
        print(math)
        print("\n")

        print("FL1:")
        print(FL1)
        print("\n")

        print("FL2:")
        print(FL2)
        print("\n")

        print("humanities:")
        print(humanities)
        print("\n")

        print("art:")
        print(art)
        print("\n")

        print("natural_science:")
        print(natural_science)
        print("\n")

        print("social_science:")
        print(social_science)
        print("\n")

        print("non_western:")
        print(non_western)
        print("\n")

        print("western:")
        print(western)
        print("\n")

        print("set1_course1:")
        print(set1_course1)
        print("\n")

        print("set1_course2:")
        print(set1_course2)
        print("\n")

        print("set2_course1:")
        print(set2_course1)
        print("\n")

        print("set2_course2:")
        print(set2_course2)
        print("\n")

        print("writing1:")
        print(writing1)
        print("\n")

        print("writing2:")
        print(writing2)
        print("\n")

        print("Number of electives:")
        print(electives)
        print("\n")

        print("progress_score:")
        print(progress_score)
        print("\n")

        #print(self.course_list)
        if self.status == "Freshman" or self.status == "First":
            if self.currentSemester == "Fall":
                if progress_score < 2:
                    print("Returning false for fall")
                    return False
            if self.currentSemester == "Winter":
                if progress_score < 5: #4
                    return False
            if self.currentSemester == "May":
                if progress_score < 5: #4
                    return False
        if self.status == "Sophomore":
            if self.currentSemester == "Fall":
                if progress_score < 8: #6
                    return False
            if self.currentSemester == "Winter":
                if progress_score < 10: #8
                    return False
            if self.currentSemester == "May":
                if progress_score < 10: 
                    return False
        if self.status == "Junior":
            if self.currentSemester == "Fall":
                if progress_score < 13: #11
                    return False
            if self.currentSemester == "Winter":
                if progress_score < 14: #13
                    return False
            if self.currentSemester == "May":
                if progress_score < 14:
                    return False
        if self.status == "Senior":
            if self.currentSemester == "Fall":
                if progress_score < 16: #16
                    return False
            if self.currentSemester == "Winter":
                if progress_score < 17: #17
                    return False
            if self.currentSemester == "May":
                if progress_score < 18:
                    return False

        #ideally this info would be pulled in from the db
        if self.degree == "CS":
            if self.status == "Junior":
                if self.currentSemester == "Fall":
                    if electives < 1:
                        return False
            if self.status == "Junior":
                if self.currentSemester == "Winter":
                    if electives < 2:
                        return False
            if self.status == "Senior":
                if self.currentSemester == "Winter":
                    if electives < 3:
                        return False

        if self.degree == "BIO":
            if self.status == "Sophomore":
                if self.currentSemester == "Winter":
                    if bioElective < 1:
                        return False
                if self.currentSemester == "May":
                    if bioElective < 2:
                        return False
            if self.status == "Junior":
                if self.currentSemester == "Fall":
                    if bioElective < 3:
                        print("Junior Fall not enough bio electives")
                        return False
                    if bioAboveElective < 1:
                        print("Junior Fall not enough bio Above electives")
                        return False; 
                if self.currentSemester == "Winter":
                    if bioAboveElective < 3:
                        print("Junior Winter not enough bio Above electives")
                        return False;
                if self.currentSemester == "May":
                    if bioScienceElective < 1:
                        print("Junior May not enough bio scince electives")
                        return False
            if self.status == "Senior":
                if self.currentSemester == "Fall":
                    if bioScienceElective < 2:
                        print("Senior Fall not enough bio scince electives")
                        return False 
                if self.currentSemester == "Winter":
                    if bioScienceElective < 3:
                        print("Senior Winter not enough bio scince electives")
                        return False

        if self.degree == "digitalArtsMedia":
            if self.status == "Junior":
                if self.currentSemester == "Fall":
                    if dartbelow < 1:
                        print("Junior Fall Missing below elective")
                        return False
            if self.status == "Junior":
                if self.currentSemester == "Winter":
                    if dartAbove < 1:
                        print("Junior Winter Missing Above elective")
                        return False

        if self.degree == "french":
            if self.status == "Sophomore":
                if self.currentSemester == "Winter":
                    if frenchElectives < 1:
                        print(frenchElectives)
                        print("Sophomore Winter Missing french elective")
                        return False
            if self.status == "Junior":
                if self.currentSemester == "Fall":
                    if frenchElectives < 2:
                        print(frenchElectives)
                        print("Junior Fall Missing french elective")
                        return False
            if self.status == "Junior":
                if self.currentSemester == "Winter":
                    if frenchElectives < 3:
                        print(frenchElectives)
                        print("Junior Winter Missing french elective")
                        return False
            if self.status == "Senior":
                if self.currentSemester == "Fall":
                    if frenchElectives < 4:
                        print(frenchElectives)
                        print("Senior Fall Missing french elective")
                        return False

        if self.degree == "businessAdministration":
            if self.status == "Junior":
                if self.currentSemester == "Fall":
                    if electives < 1:
                        print(electives)
                        print("Junior Fall Missing BA elective")
                        return False
            if self.status == "Junior":
                if self.currentSemester == "Winter":
                    if electives < 2:
                        print(electives)
                        print("Junior Winter Missing BA elective")
                        return False
            if self.status == "Senior":
                if self.currentSemester == "Fall":
                    if electives < 3:
                        print(electives)
                        print("Senior Fall Missing BA elective")
                        return False
            if self.status == "Senior":
                if self.currentSemester == "Winter":
                    if electives < 4:
                        print(electives)
                        print("Junior Winter Missing BA elective")
                        return False
        return True

            
