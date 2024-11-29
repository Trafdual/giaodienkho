import React, { useState } from 'react';
import "./HeaderTroGiupTQ.scss";
import QuillHtmlContent from "../Quill/QuillHtml";
const Header = () => {

    const [quillHtmlContent, setQuillHtmlContent] = useState('<p>Đây là một ví dụ về <strong>Quill</strong> Editor.</p>');

    return (
        <div>
            <ul>
                <li><a href="#">Home</a></li>
                <li>
                    <a href="#">Dashboard</a>
                    <ul className="dropdown-help">
                        <li><a href="#">Settings</a></li>
                        <li><a href="#">Logout</a></li>
                        <li><a href="#">Settings</a></li>
                        <li><a href="#">Logout</a></li>
                    </ul></li>
                <li><a href="#">Settings</a></li>
                <li><a href="#">Logout</a></li>
            </ul>

            <QuillHtmlContent quillHtmlContent={quillHtmlContent} />

        </div>);
};

export default Header;
