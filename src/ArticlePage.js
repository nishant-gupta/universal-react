/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React from 'react';
import { useParams } from "react-router-dom";
import { addAemHost } from "./api/aemHeadlessClient";

//import backIcon from '../images/icon-close.svg';
import { mapJsonRichText } from './utils/renderRichText';
import './ArticleDetail.scss';
import Error from "./Error";
import Loading from "./Loading";
import { useArticleBySlug } from './api/usePersistedQueries';

function ArticlePage() {

    // Read the slug value which is the parameter used to query for the article's details
    const { slug } = useParams();
    console.log(slug);
    //const slug = "introduction";

    // Query AEM for the Article's details, using the `slug`
    const { article, references, error } = useArticleBySlug(slug, { format: 'JPG', preferWebp: true, width: 1200});

    // Handle error and loading conditions
    if (error) {
        return <Error errorMessage={error} />;
    } else if (!article) {
        return <Loading />;
    }

    console.log(article);
    const editorProps = {
		itemID: "urn:aemconnection:" + article._path + "/jcr:content/data/master",
		itemType: "reference",
		itemfilter: "cf"
	};

    return (<div {...editorProps} itemScope className="article-detail">
        {/* <Link className="article-detail-close-button"  to="/">
            <img className="Backbutton-icon" src={backIcon} alt="Return" />
        </Link> */}
        <ArticleDetailRender {...article} references={references} />
    </div>);

}

function ArticleDetailRender({ articleTitle,
    articleSections,
    primaryimage,
    references }) {

        console.log(primaryimage);

        

    return (<>
        <h1 itemProp="articleTitle" itemType="text" className="article-detail-title">{articleTitle}</h1>
        {/* <div className="article-detail-info">
            
            <div className="article-detail-info-description">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)}
            </div>
        </div> */}
        <img itemProp="primaryimage" itemType="media"className="article-detail-primaryimage"
                src={addAemHost( primaryimage._path)} alt={articleTitle} />
        <div className="article-detail-content">
            {articleSections.map((articleSection, index) => {
                const editorProps = {
                    itemID: "urn:aemconnection:" + articleSection._path + "/jcr:content/data/master",
                    itemType: "reference",
                    itemfilter: "cf"
                };

                return <ArticleSectionRender  key={index} {...articleSection} references={references} editorProps={editorProps}/>
            })}
            
            {/* <div>{mapJsonRichText(summary.json, customRenderOptions(references))}</div> */}
            

            {/* Render the itinerary without any custom render options (just use defaults) */}
            {/* <div className="article-detail-itinerary">{mapJsonRichText(itinerary.json)}</div> */}
        </div>
    </>
    );
}

function ArticleSectionRender({ title, body, references, editorProps }) {
    return (<>
        <div {...editorProps} itemScope className="article-detail-section">
            <h2 itemProp="title" itemType="text">{title}</h2>
            
            <div itemProp="body" itemType="richtext" className='article-detail-section-body'>{mapJsonRichText(body.json, customRenderOptions(references))}</div>
        </div>
        </>);
}
/**
 * Example of using a custom render for in-line references in a multi line field
 */
function customRenderOptions(references) {

    console.log('references',references);
    const renderReference = {
        // node contains merged properties of the in-line reference and _references object
        'ImageRef': (node) => {
            // when __typename === ImageRef
            return <img src={addAemHost(node._path)} alt={'in-line reference'} />
        },
        // 'AdventureModel': (node) => {
        //     // when __typename === AdventureModel
        //     return <Link to={`/article:${node.slug}`}>{`${node.title}: ${node.price}`}</Link>;
        // }
    };

    return {
        nodeMap: {
            'reference': (node, children) => {

                // variable for reference in _references object
                let reference;

                // asset reference
                if (references && node.data.path) {
                    // find reference based on path
                    reference = references.find(ref => ref._path === node.data.path);
                }
                // Fragment Reference
                if (references && node.data.href) {
                    // find in-line reference within _references array based on href and _path properties
                    reference = references.find(ref => ref._path === node.data.href);
                }

                // if reference found return render method of it
                return reference ? renderReference[reference.__typename]({ ...reference, ...node }) : null;
            }
        },
    };
}

export default ArticlePage;