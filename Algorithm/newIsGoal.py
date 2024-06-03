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
        FYS = False

        if self.status != "Freshman":
            FYS = True

        if self.currentSemester == "May":
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
                    #chnage to false so if the degree is in the system, it will check to see if it is correct
                    if self.track in required_program_course.get("trackName") or self.track == "null":
                        if self.status in required_program_course.get("status"):
                            if self.currentSemester in required_program_course.get("semester"):
                                #required_courses_count = required_courses_count + 1
                                #print("comparing taken courses")
                                #print(required_program_course.get("courseId"))
                                #print(taken_course)
                                #print("\n")
                                    for requirement in filled_requirements:
                                        print("taken_course")
                                        print(taken_course)
                                        print("requirement")
                                        print(requirement)
                                        if taken_course != requirement:
                                            print("not yet taken")

                                if str(required_program_course.get("courseId")) == str(taken_course) or str(required_program_course.get("choiceCourses")) == str(taken_course) or str(required_program_course.get("choiceCourses2")) == str(taken_course):
                                    print("passed taken")
                                    print(required_program_course.get("courseId"))
                                    print(taken_course)
                                    print("\n")
                                    required_courses_in_schedule = required_courses_in_schedule + 1
                                                filled_requirements.append(required_program_course.get("courseId"))
                                                filled_requirements.append(required_program_course.get("choiceCourses"))
                                                filled_requirements.append(required_program_course.get("choiceCourses2"))
        for course in assignment:
            required_courses_count = 0 
            for required_program_course in required_program_courses:
                #print(required_program_course.get("programName"))
                if self.degree in required_program_course.get("programName"):
                    #chnage to false so if the degree is in the system, it will check to see if it is correct
                    if self.track in required_program_course.get("trackName") or self.track == "null":
                        if self.status in required_program_course.get("status"):
                            if self.currentYear in required_program_course.get("year") or required_program_course.get("year") == "All":
                                
                                if self.currentSemester in required_program_course.get("semester"):
                                    required_courses_count = required_courses_count + 1
                                    print("comparing going to take")
                                    print(course.get("courseId"))
                                    print(required_program_course.get("courseId"))
                                    print(required_program_course.get("choiceCourses"))
                                    print(required_program_course.get("choiceCourses2"))
                                    print("\n")
                                    if str(required_program_course.get("courseId")) == str(course.get("courseId")) or str(required_program_course.get("choiceCourses")) == str(course.get("courseId")) or str(required_program_course.get("choiceCourses2")) == str(course.get("courseId")):
                                        print("passed schedule")
                                        required_courses_in_schedule = required_courses_in_schedule + 1

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
        print("COUNT in schedule", required_courses_in_schedule)
        print("COUNT courses", required_courses_count)

        if required_courses_in_schedule >= required_courses_count:
            degreeGoal = True
  
        #print("degreeGoal", degreeGoal)
        #print("creditGoal", creditGoal)
        #print("FYS", FYS)
        if degreeGoal == True and creditGoal == True and FYS == True:
            print("return yes")
            return "Yes"
        elif self.degree == "null" and creditGoal == True and FYS == True:
            #print("return yes")
            return "Yes"
        else:
            #print("return no")
            return "No"

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
        FYS = False

        if self.status != "Freshman":
            FYS = True

        if self.currentSemester == "May":
            FYS = True

        #starts as true so if you put in a degree not in the system it will not crash
        required_courses_count = 0
        required_courses_in_schedule = 0
        #print(assignment)

        
        for course in assignment:
            required_courses_count = 0 
            for required_program_course in required_program_courses:
                #print(required_program_course.get("programName"))
                if self.degree in required_program_course.get("programName"):
                    #chnage to false so if the degree is in the system, it will check to see if it is correct
                    if self.track in required_program_course.get("trackName") or self.track == "null":
                        if self.status in required_program_course.get("status"):
                            if self.currentYear in required_program_course.get("year") or required_program_course.get("year") == "All":
                                if self.currentSemester in required_program_course.get("semester"):
                                    required_courses_count = required_courses_count + 1
                                    if str(required_program_course.get("courseId")) == str(course.get("courseId")) or str(required_program_course.get("choiceCourses")) == str(course.get("courseId")) or str(required_program_course.get("choiceCourses2")) == str(course.get("courseId")):
                                        #print("passed schedule")
                                        required_courses_in_schedule = required_courses_in_schedule + 1

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

        for required_program_course in required_program_courses:
            for taken_course in self.course_taken_unit:
                #print(required_program_course.get("programName"))
                if self.degree in required_program_course.get("programName"):
                    #chnage to false so if the degree is in the system, it will check to see if it is correct
                    if self.track in required_program_course.get("trackName") or self.track == "null":
                        if self.status in required_program_course.get("status"):
                            if self.currentSemester in required_program_course.get("semester"):

                                #required_courses_count = required_courses_count + 1
                                #print("comparing taken courses")
                                #print(required_program_course.get("courseId"))
                                #print(taken_course)
                                #print("\n")
                                if str(required_program_course.get("courseId")) == str(taken_course):
                                    required_courses_in_schedule = required_courses_in_schedule + 1
                                #else:
                                    #degreeGoal = False

        if required_courses_in_schedule >= required_courses_count:
            degreeGoal = True
  
        #print("degreeGoal", degreeGoal)
        #print("creditGoal", creditGoal)
        #print("FYS", FYS)
        if degreeGoal == True and creditGoal == True and FYS == True:
            return "Yes"
        elif self.degree == "null" and creditGoal == True and FYS == True:
            #print("return yes")
            return "Yes"
        else:
            #print("return no")
            return "No"