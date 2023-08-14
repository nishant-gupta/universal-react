/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
// import React, {useState} from 'react';
import Articles from './Articles';

/***
 * Displays a grid of current adventures
 */
 function Home() {

    return (
      <div className="Home">
        <h2>Current Articles</h2>
        {/* <div className="article-nav">
          <button onClick={() => setArticleType('introduction')}>Introduction</button>
        </div> */}
        <Articles/>
    </div>
    );
}

export default Home;