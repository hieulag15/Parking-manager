import { createGlobalStyle } from 'styled-components';
import LexendThinFont from '~/assets/fonts/lexend/Lexend-Thin.ttf';
import LexendLightFont from '~/assets/fonts/lexend/Lexend-Light.ttf';
import LexendRegularFont from '~/assets/fonts/lexend/Lexend-Regular.ttf';
import LexendMediumFont from '~/assets/fonts/lexend/Lexend-Medium.ttf';
import LexendSemiBoldFont from '~/assets/fonts/lexend/Lexend-SemiBold.ttf';
import LexendBoldFont from '~/assets/fonts/lexend/Lexend-Bold.ttf';

export default createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    @font-face {
        font-family: 'lexend';
        font-display: block;
        font-style:normal;
        src: url(${LexendRegularFont})  format('truetype');
    }
    @font-face {
        font-family: 'lexend';
        font-weight: 300;
        font-display: block;
        src: url(${LexendLightFont})  format('truetype');
    }
    @font-face {
        font-family: 'lexend';
        font-weight: 500;
        font-display: block;
        src: url(${LexendMediumFont})  format('truetype');
    }

    @font-face {
        font-family: 'lexend';
        font-weight: 600;
        font-display: block;
        src: url(${LexendSemiBoldFont})  format('truetype');
    }
    @font-face {
        font-family: 'lexend';
        font-weight: 700;
        font-display: block;
        src: url(${LexendBoldFont})  format('truetype');
    }

    :root {
        font-size: 14px;
        --bg-main-color: linear-gradient(360deg, #040B2D 0%, #0C2163 53.65%, #103258 100%);
    }

    iframe#webpack-dev-server-client-overlay{display:none!important}

    body {
        font-family: 'Lexend', sans-serif;
    }

    html {
        font-size: 62.5%;
    }

    a {
        text-decoration: none;
    }
    
    img{
        object-fit: contain;
    }

    .border-none: {
        border: none;
    }

    .border-1 {
        border-radius: 8px;
    }

    .k-card {
        border-radius: 8px;
        &.hide-header {
            .k-card-header {
                display: none;
            }
        }

        .k-card-body {
            padding-inline: 0;
            padding-block: 0;
        }
    }

    .ant-card.card-main{
        border-radius: 10px;
        height: 100%;
        display: flex;
        flex-direction: column;
        border: none;

        .ant-card-head {
            padding: 10px 10px 0px;
            border: none;
            min-height: auto;
            .ant-card-head-title {
                display: contents;
                padding: 0;
            }
            .ant-card-extra{
                padding: 0;
            }
        }

        .ant-card-body {
            flex: 1;
            padding: 0 16px;
        }
    }
`;
