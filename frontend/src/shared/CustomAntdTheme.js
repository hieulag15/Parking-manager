import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
    .ant-menu {
        .ant-menu-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100px;

            .anticon {
                font-size: 1.6rem;
            }

            .ant-menu-title-content {
                margin-inline-start: 0 !important;
                font-weight: 600;
                font-size: 1.2rem;
            }
        }
    }

    .ant-image-img {
        border-radius: 8px;
    }

    .ant-card {
        &.event-card {
            .ant-card-head {
                min-height: 2.6rem;
                border-bottom-color: transparent;
            }

            .ant-card-body {
                padding: 0.4rem;
            }

            .event-tag {
                position: absolute;
                right: -4px;
                bottom: 4px;
            }
        }
    }

    .ant-table {
        border: 1px solid #f0f0f0;
    }

    .ct-border {
        border: 1px solid #f0f0f0;
    }

    .ant-spin-nested-loading {
        &.h-100 {
            > div {
                height: 100%;
            }
        }
    }
`;
