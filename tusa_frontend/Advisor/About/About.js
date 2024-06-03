import React from 'react';
import '../tusastyles.css';
import './aboutstyles.css'; 
import NavBar from '../NavBar';
import Header from '../Header';

function FAQs() {
    return (
	<div>
	    <Header />
	    <div className="below-nav">
		<NavBar />
		<section className="title">
		    <p className="title-text"> ABOUT T.U.S.A. </p>
		</section>
		<br/>
		<div className="about-section">
		    <p className="tusa-about"> One of the most pressing issues plaguing college students today is planning out their four year schedules to ensure they meet all of the requirements to graduate on time. More often than not, this leads to stress and turmoil in a student’s life as they try to figure out the best time in their four year plan to take certain courses and forces them to make these major decisions when they are only mere first-years in college. This pre-planning often leads to a rigidness and much unneeded stress in the scheduling process where students are forced to choose between their interests and their graduation. Sooner or later, they will find that they have accidentally deviated from this plan and have to make an entirely new plan to continue to ensure their on-schedule graduation. This takes much thought and effort on the part of the student on top of all the work they need to accomplish for their current classes. </p>
		    <p className="tusa-about"> The Transylvania University Scheduling Assistant (TUSA) attempts to remedy these issues by introducing an automated scheduling system into students’ lives that does all the thinking and pre-planning for them, taking the stress completely out of schedule planning. Not only will TUSA generate a valid four year plan for students, it will also take into account their interests when devising the schedule, making for the most pleasant experience possible during their four years at Transylvania University. When they inevitably deviate from the schedule provided to them, all they have to do is simply tell TUSA what classes they have already taken and TUSA will devise a new plan for them to ensure their timely graduation. With stress and headaches over scheduling no more, students will have ample time to focus on what is really important: their classes. TUSA also features new and improved versions of staples of Transylvania’s current platform, TNet Self-Service, such as graduation progress, notes, and the course catalog. To top it all off, TUSA includes some never-before-seen features such as course polls/suggestions, a personalized calendar, and the ability to input course preferences to make students’ schedules unique to their own interests. TUSA strives to make the lives of each and every student on Transylvania’s campus easier so they can enjoy their college experience. </p>

		    <img src="./TusaMembers.jpg" alt="TUSA Members" />

		</div>
	    </div>
	</div>
    );
}

export default FAQs;
