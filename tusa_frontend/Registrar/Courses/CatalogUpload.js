import React, { useState } from 'react';
import {
    Button,
    Confirm,
    useRecordContext,
    useDelete,
    Admin, defaultTheme
} from 'react-admin';
import '../tusastyles.css';
//import './uploadstyles.css';
import Header from '../Header';
import NavBar from '../NavBar';
import axios from 'axios';
function UploadCatalog() {
    const [file, setFile] = useState(null);
    const [open, setOpen] = useState(false);
    
    const handleFileChange = (event) => {
	setFile(event.target.files[0]); };

/*
    const handleSubmit = async (event) => {
	event.preventDefault();
	if (!file) { alert('Please select a file.');
		     return;
		   }
	const formData = new FormData();
	formData.append('file', file);
	try {
	    console.log('File:', formData);
	    const response = await axios.post(`http://www.cs.transy.edu/TUSA/js-login/front/build/CoursesCSVUpload.cgi?`, formData,
					      { headers: {
						  'Content-Type': 'multipart/form-data', 
					      }
					      }
					     );

	    console.log("Response:", response.data);
	      if (response.status === 200) {
		  alert('Catalog Uploaded Successfully!');
	      } else { alert('Catalog Failed to Upload :('); }
	    } catch (error) { console.error('Error:', error);
			      alert('An error occurred. Please try again later.'); }
    };
*/

    const handleClick = () => setOpen(true);
    const handleDialogClose = () => setOpen(false);
    const handleConfirm = () => {
	handleDelete();
	setOpen(false);
    };
    
    const handleDelete = async () => {
	try {
	    const response = await axios.get('http://www.cs.transy.edu/TUSA/js-login/front/build/DeleteCatalog.cgi');
	    if (response.status === 200) { alert('Catalog Deleted Successfully!'); } else { alert('Catalog Failed to Delete :('); }
	} catch (error) {
	    console.error('Error:', error);
	    alert('An error occurred. Please try again later.');
	}
    };
    return (
	<div>
	    <Header />
	    <div className="below-nav">
		<NavBar />
		<main>
		    <div className="below-nav">
			<section className="title">
			    <p className="title-text"> CATALOG UPLOAD </p>
			</section>
			<b> Note: Please be sure to put a space between commas when creating NULLS </b> <br />
			<form id="m_tags" name="m__dataEntryTags" action="http://www.cs.transy.edu/TUSA/js-login/front/build/CoursesCSVUpload.cgi" method="post" target="_blank"> Select file to upload:
			    <input type="file" onChange={handleFileChange} name="fileName" /> <br /> <br />
			    <button className="declare-button" type="submit"> Upload Catalog </button>
			</form>
			<br />
			<button className="declare-button" onClick={handleClick}> Delete ENTIRE Catalog </button>
			<Confirm isOpen={open} title={`Delete ENTIRE Catalog`} content="Are you sure you want to delete the ENTIRE catalog?" onConfirm={handleConfirm} onClose={handleDialogClose} confirm="Delete" cancel="Cancel" />
			<br />
		    </div>
		</main>
	    </div>
	</div>
    );
}

export default UploadCatalog;




