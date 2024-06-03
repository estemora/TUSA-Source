import React, { useState, useEffect } from 'react';
import '../tusastyles.css';
import Header from '../Header';
import NavBar from '../NavBar';
import axios from 'axios';

function UploadCatalog() {
    const [fileName, setFileName] = useState('');

    const handleSubmit = async () => {
	 try {
	     await uploadCatalog();
	 } catch (error) {
	     console.error('Error:', error);
	     alert('An error occurred. Please try again later here.');
	 }
    };

    const handleInput = (event) => {
	const { name, value } = event.target;
	if (name === 'file') {
	    setFileName(value);
	}
    };

    const uploadCatalog = async () => {
	try {
	    const response = await axios.get(`http://www.cs.transy.edu/TUSA/js-login/front/build/CatalogUpload.cgi?fileName=${fileName}`);
 	    if (response.status === 200) {
		alert(`Catalog Uploaded Sucessfully!`);
	    } else {
		alert(`Catalog Failed to Upload :(`);
	    }
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
			<form id="m_tags" name="m__dataEntryTags" onSubmit={handleSubmit}>
   			    Select file to upload:  <input type="file" onChange={handleInput} name="file" size="40" />
			    <br /> <br />
			    <button class="declare-button" type="submit"> Upload Catalog </button>
   			</form>
			<br />
		    </div>
		</main>
	    </div>
	</div>
    );
}

export default UploadCatalog;
