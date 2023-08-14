/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React from "react";
import { Link } from "react-router-dom";
//import { useArticles } from "./api/usePersistedQueries";
import Error from "./Error";
import Loading from "./Loading";
import { addAemHost } from "./api/aemHeadlessClient";

//import backIcon from '../images/icon-close.svg';
import { mapJsonRichText } from './utils/renderRichText';
//import './Article.scss';

function Article() {
    //const assetTransform = { format: 'JPG', preferWebp: true, size: { width: 240, height: 200 } };
//    const { articles, error, references } = useArticles(assetTransform);
    const { articles, error, references } = {articles: [{
        "articleTitle": "Introduction",
        "slug": "introduction"
    }], error: null, references: []};


    console.log(articles);

    // Handle error and loading conditions
    if (error) {
        return <Error errorMessage={error} />;
    } else if (!articles) {
        return <Loading />;
    }

    return (
        <div className="articles">
            <ul className="article-items">
                {articles.map((article, index) => {
                    console.log(article);
                    return <ArticleListItem key={index} {...article} references={references}/>
                })}
            </ul>
        </div>
    );
}

// Render individual Article item
function ArticleListItem({ articleTitle, slug, teaserimage, summary, references }) {
    // Must have title, path, and image
    if (!articleTitle || !slug) {
        return null;
    }

    return (
        <li className="article-item">
            <Link to={`/article/${slug}`}>
                {articleTitle}
            </Link>
            
            <div className="article-item-title">{articleTitle}</div>
            {/* <img className="article-detail-primaryimage"
                src={addAemHost(teaserimage._path)} alt={articleTitle} />
            <div>{mapJsonRichText(summary.json, customRenderOptions(references))}</div> */}
        </li>
    );
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
export default Article;