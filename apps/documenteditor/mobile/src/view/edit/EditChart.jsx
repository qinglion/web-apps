import React, {Fragment, useState} from 'react';
import {observer, inject} from "mobx-react";
import { List, ListItem, ListButton, Icon, Page, Navbar, NavRight, BlockTitle, Toggle, Range, Link } from 'framework7-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {f7} from 'framework7-react';
import { useTranslation } from 'react-i18next';
import {Device} from '../../../../../common/mobile/utils/device';
import {CustomColorPicker, ThemeColorPalette} from "../../../../../common/mobile/lib/component/ThemeColorPalette.jsx";
import SvgIcon from '@common/lib/component/SvgIcon';
import IconExpandDownIos from '@common-ios-icons/icon-expand-down.svg?ios';
import IconExpandDownAndroid from '@common-android-icons/icon-expand-down.svg';
import IconWrapInline from '@ios-icons/icon-wrap-inline.svg';
import IconWrapSquare from '@ios-icons/icon-wrap-square.svg';
import IconWrapTight from '@ios-icons/icon-wrap-tight.svg';
import IconWrapThrough from '@ios-icons/icon-wrap-through.svg';
import IconWrapTopBottom from '@ios-icons/icon-wrap-top-bottom.svg';
import IconWrapInFront from '@ios-icons/icon-wrap-infront.svg';
import IconWrapBehind from '@ios-icons/icon-wrap-behind.svg';
import IconBlockAlignLeft from '@icons/icon-block-align-left.svg';
import IconBlockAlignCenter from '@icons/icon-block-align-center.svg';
import IconBlockAlignRight from '@icons/icon-block-align-right.svg';
import IconMoveForeground from '@common-icons/icon-move-foreground.svg';
import IconMoveBackground from '@common-icons/icon-move-background.svg';
import IconMoveForward from '@common-icons/icon-move-forward.svg';
import IconMoveBackward from '@common-icons/icon-move-backward.svg';

const PageCustomFillColor = props => {
    const { t } = useTranslation();
    const _t = t('Edit', {returnObjects: true});
    let fillColor = props.storeChartSettings.fillColor;
    if (typeof fillColor === 'object') {
        fillColor = fillColor.color;
    }
    const onAddNewColor = (colors, color) => {
        props.storePalette.changeCustomColors(colors);
        props.onFillColor(color);
        props.storeChartSettings.setFillColor(color);
        props.f7router.back();
    };
    return(
        <Page>
            <Navbar title={_t.textCustomColor} backLink={_t.textBack}>
                {Device.phone &&
                    <NavRight>
                        <Link sheetClose='#edit-sheet'>
                            {Device.ios ? 
                                <SvgIcon symbolId={IconExpandDownIos.id} className={'icon icon-svg'} /> :
                                <SvgIcon symbolId={IconExpandDownAndroid.id} className={'icon icon-svg white'} />
                            }
                        </Link>
                    </NavRight>
                }
            </Navbar>
            <CustomColorPicker currentColor={fillColor} onAddNewColor={onAddNewColor}/>
        </Page>
    )
};

const PaletteFill = inject("storeFocusObjects", "storeChartSettings", "storePalette")(observer(props => {
    const { t } = useTranslation();
    const _t = t('Edit', {returnObjects: true});
    const storeChartSettings = props.storeChartSettings;
    const shapeProperties = props.storeFocusObjects.shapeObject.get_ShapeProperties();
    const curFillColor = storeChartSettings.fillColor ? storeChartSettings.fillColor : storeChartSettings.getFillColor(shapeProperties);
    const customColors = props.storePalette.customColors;
    const changeColor = (color, effectId, effectValue) => {
        if (color !== 'empty') {
            if (effectId !==undefined ) {
                const newColor = {color: color, effectId: effectId, effectValue: effectValue};
                props.onFillColor(newColor);
                storeChartSettings.setFillColor(newColor);
            } else {
                props.onFillColor(color);
                storeChartSettings.setFillColor(color);
            }
        } else {
            // open custom color menu
            props.f7router.navigate('/edit-chart-custom-fill-color/', {props: {onFillColor: props.onFillColor}});
        }
    };
    return(
        <Fragment>
            <ThemeColorPalette changeColor={changeColor} curColor={curFillColor} customColors={customColors} transparent={true}/>
            <List>
                <ListItem title={_t.textAddCustomColor} link={'/edit-chart-custom-fill-color/'} routeProps={{
                    onFillColor: props.onFillColor
                }}></ListItem>
            </List>
        </Fragment>
    )
}));

const PageCustomBorderColor = props => {
    const { t } = useTranslation();
    const _t = t('Edit', {returnObjects: true});
    let borderColor = props.storeChartSettings.borderColor;
    if (typeof borderColor === 'object') {
        borderColor = borderColor.color;
    }
    const onAddNewColor = (colors, color) => {
        props.storePalette.changeCustomColors(colors);
        props.onBorderColor(color);
        props.storeChartSettings.setBorderColor(color);
        props.f7router.back();
    };
    return(
        <Page>
            <Navbar title={_t.textCustomColor} backLink={_t.textBack}>
                {Device.phone &&
                    <NavRight>
                        <Link sheetClose='#edit-sheet'>
                            {Device.ios ? 
                                <SvgIcon symbolId={IconExpandDownIos.id} className={'icon icon-svg'} /> :
                                <SvgIcon symbolId={IconExpandDownAndroid.id} className={'icon icon-svg white'} />
                            }
                        </Link>
                    </NavRight>
                }
            </Navbar>
            <CustomColorPicker currentColor={borderColor} onAddNewColor={onAddNewColor}/>
        </Page>
    )
};

const PageBorderColor = props => {
    const { t } = useTranslation();
    const _t = t('Edit', {returnObjects: true});
    const borderColor = props.storeChartSettings.borderColor;
    const customColors = props.storePalette.customColors;
    const changeColor = (color, effectId, effectValue) => {
        if (color !== 'empty') {
            if (effectId !==undefined ) {
                const newColor = {color: color, effectId: effectId, effectValue: effectValue};
                props.onBorderColor(newColor);
                props.storeChartSettings.setBorderColor(newColor);
            } else {
                props.onBorderColor(color);
                props.storeChartSettings.setBorderColor(color);
            }
        } else {
            // open custom color menu
            props.f7router.navigate('/edit-chart-custom-border-color/', {props: {onBorderColor: props.onBorderColor}});
        }
    };
    return(
        <Page>
            <Navbar title={_t.textColor} backLink={_t.textBack}>
                {Device.phone &&
                    <NavRight>
                        <Link sheetClose='#edit-sheet'>
                            {Device.ios ? 
                                <SvgIcon symbolId={IconExpandDownIos.id} className={'icon icon-svg'} /> :
                                <SvgIcon symbolId={IconExpandDownAndroid.id} className={'icon icon-svg white'} />
                            }
                        </Link>
                    </NavRight>
                }
            </Navbar>
            <ThemeColorPalette changeColor={changeColor} curColor={borderColor} customColors={customColors}/>
            <List>
                <ListItem title={_t.textAddCustomColor} link={'/edit-chart-custom-border-color/'} routeProps={{
                    onBorderColor: props.onBorderColor
                }}></ListItem>
            </List>
        </Page>
    )
};

const PageChartType = props => {
    const { t } = useTranslation();
    const storeChartSettings = props.storeChartSettings;
    const types = storeChartSettings.types;
    const countSlides = Math.floor(types.length / 3);
    const arraySlides = Array(countSlides).fill(countSlides);
    const storeFocusObjects = props.storeFocusObjects;
    const chartProperties = storeFocusObjects.chartObject && storeFocusObjects.chartObject.get_ChartProperties();
    const curType = chartProperties && chartProperties.getType();

    return (
        <Page>
            <Navbar backLink={t('Edit.textBack')} title={t('Edit.textType')} />

            <div id={"edit-chart-type"} className="page-content no-padding-top dataview">
                <div className="chart-types">
                    {types && types.length ? (
                        <Swiper>
                            {arraySlides.map((_, indexSlide) => {
                                let typesSlide = types.slice(indexSlide * 3, (indexSlide * 3) + 3);

                                return (
                                    <SwiperSlide key={indexSlide}>
                                        {typesSlide.map((row, rowIndex) => {
                                            return (
                                                <ul className="row" key={`row-${rowIndex}`}>
                                                    {row.map((type, index) => {
                                                        return (
                                                            <li key={`${rowIndex}-${index}`}
                                                                className={curType === type.type ? ' active' : ''}
                                                                onClick={() => {props.onType(type.type)}}>
                                                                <div className={'thumb'}
                                                                    style={{backgroundImage: `url('resources/img/charts/${type.thumb}')`}}>
                                                                </div>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            )
                                        })}
                                    </SwiperSlide>
                                )
                            })}
                        </Swiper>
                    ) : null}
                </div>
            </div>
        </Page>
    )
}

const PageChartStyle = props => {
    const { t } = useTranslation();
    const storeChartSettings = props.storeChartSettings;
    const styles = storeChartSettings.styles;
    const chartStyles = storeChartSettings.chartStyles;

    return (
        <Page>
            <Navbar backLink={t('Edit.textBack')} title={t('Edit.textStyle')} />

            {chartStyles ? 
                    <div id={"edit-chart-style"} className="page-content no-padding-top dataview">
                        <div className={'chart-styles'}>
                            <ul className="row">
                                {styles ? styles.map((row, rowIndex) => {
                                    return (
                                        row.map((style, index)=>{
                                            return(
                                                <li key={`${rowIndex}-${index}`}
                                                    onClick={() => {props.onStyle(style.asc_getName())}}>
                                                    <img src={`${style.asc_getImage()}`}/>
                                                </li>
                                            )
                                        })
                                    )        
                                }) : <div className={'text-content'}>{t('Edit.textNoStyles')}</div>
                                }
                            </ul>
                        </div>
                    </div>
                : null}
        </Page>
    )
}

const PageChartDesignFill = props => {
    const { t } = useTranslation();

    return (
        <Page>
            <Navbar backLink={t('Edit.textBack')} title={t('Edit.textFill')} />
            <div id={"edit-chart-fill"} className="page-content no-padding-top">
                <PaletteFill onFillColor={props.onFillColor} f7router={props.f7router}/>
            </div>
        </Page>
    )
}

const PageChartBorder = props => {
    const { t } = useTranslation();
    const storeChartSettings = props.storeChartSettings;
    const shapeObject = props.storeFocusObjects.shapeObject;

    let borderSize, borderType, borderColor;
    if (shapeObject) {
        const shapeStroke = shapeObject.get_ShapeProperties().get_stroke();
        borderSize = shapeStroke.get_width() * 72.0 / 25.4;
        borderType = shapeStroke.get_type();
        borderColor = !storeChartSettings.borderColor ? storeChartSettings.initBorderColor(shapeStroke) : storeChartSettings.borderColor;
    }

    // Init border size
    const borderSizeTransform = storeChartSettings.borderSizeTransform();
    const displayBorderSize = (borderType == Asc.c_oAscStrokeType.STROKE_NONE || borderType === undefined) ? 0 : borderSizeTransform.indexSizeByValue(borderSize);
    const displayTextBorderSize = (borderType == Asc.c_oAscStrokeType.STROKE_NONE || borderType === undefined) ? 0 : borderSizeTransform.sizeByValue(borderSize);
    const [stateBorderSize, setBorderSize] = useState(displayBorderSize);
    const [stateTextBorderSize, setTextBorderSize] = useState(displayTextBorderSize);

    // Init border color
    const displayBorderColor = borderColor !== 'transparent' ? `#${(typeof borderColor === "object" ? borderColor.color : borderColor)}` : borderColor;
    
    return (
        <Page>
            <Navbar backLink={t('Edit.textBack')} title={t('Edit.textBorder')} />

            <div id={"edit-chart-border"} className="page-content no-padding-top">
               <List>
                    <ListItem>
                        <div slot="root-start" className='inner-range-title'>{t('Edit.textSize')}</div>
                        <div slot='inner' style={{width: '100%'}}>
                            <Range min="0" max="7" step="1" value={stateBorderSize}
                                   onRangeChange={(value) => {setBorderSize(value); setTextBorderSize(borderSizeTransform.sizeByIndex(value));}}
                                   onRangeChanged={(value) => {props.onBorderSize(borderSizeTransform.sizeByIndex(value))}}
                            ></Range>
                        </div>
                        <div className='range-number' slot='inner-end'>
                            {stateTextBorderSize + ' ' + Common.Utils.Metric.getMetricName(Common.Utils.Metric.c_MetricUnits.pt)}
                        </div>
                    </ListItem>
                    <ListItem title={t('Edit.textColor')} link='/edit-chart-border-color/' routeProps={{
                        onBorderColor: props.onBorderColor
                    }}>
                        <span className="color-preview"
                              slot="after"
                              style={{ background: displayBorderColor }}
                        ></span>
                    </ListItem>
                </List>
            </div>
        </Page>
    )
}

const PageDesign = props => {
    const { t } = useTranslation();
    const chartProperties = props.storeFocusObjects.chartObject ? props.storeFocusObjects.chartObject.get_ChartProperties() : null;

    // console.log(chartStyles, curType);
    // console.log(Asc.c_oAscChartTypeSettings.comboBarLine, Asc.c_oAscChartTypeSettings.comboBarLineSecondary, Asc.c_oAscChartTypeSettings.comboAreaBar, Asc.c_oAscChartTypeSettings.comboCustom);

    if (!chartProperties && Device.phone) {
        $$('.sheet-modal.modal-in').length > 0 && f7.sheet.close();
        return null;
    }

    return (
        <Page>
            <Navbar backLink={t('Edit.textBack')} title={t('Edit.textDesign')}>
                {Device.phone &&
                    <NavRight>
                        <Link sheetClose='#edit-sheet'>
                            {Device.ios ? 
                                <SvgIcon symbolId={IconExpandDownIos.id} className={'icon icon-svg'} /> :
                                <SvgIcon symbolId={IconExpandDownAndroid.id} className={'icon icon-svg white'} />
                            }
                        </Link>
                    </NavRight>
                }
            </Navbar>
            <Fragment>
                <List>
                    <ListItem title={t('Edit.textType')} link='/edit-chart-type/' routeProps = {{onType: props.onType}} />
                    <ListItem title={t('Edit.textStyle')} link='/edit-chart-style/' routeProps = {{onStyle: props.onStyle}} />
                    <ListItem title={t('Edit.textFill')} link='/edit-chart-fill/' routeProps = {{onFillColor: props.onFillColor}} />
                    <ListItem title={t('Edit.textBorder')} link='/edit-chart-border/' routeProps = {{
                        onBorderSize: props.onBorderSize,
                        onBorderColor: props.onBorderColor
                    }} />
                </List>
            </Fragment>
        </Page>
    )
};

const PageWrap = props => {
    const isAndroid = Device.android;
    const { t } = useTranslation();
    const _t = t('Edit', {returnObjects: true});
    const storeChartSettings = props.storeChartSettings;
    const chartObject = props.storeFocusObjects.chartObject;
    let wrapType, align, moveText, overlap, distance;
    if (chartObject) {
        wrapType = storeChartSettings.getWrapType(chartObject);
        align = storeChartSettings.getAlign(chartObject);
        moveText = storeChartSettings.getMoveText(chartObject);
        overlap = storeChartSettings.getOverlap(chartObject);
        distance = Common.Utils.Metric.fnRecalcFromMM(storeChartSettings.getWrapDistance(chartObject));
    }
    const metricText = Common.Utils.Metric.getCurrentMetricName();
    const [stateDistance, setDistance] = useState(distance);
    if (!chartObject && Device.phone) {
        $$('.sheet-modal.modal-in').length > 0 && f7.sheet.close();
        return null;
    }
    return (
        <Page>
            <Navbar title={_t.textWrap} backLink={_t.textBack}>
                {Device.phone &&
                    <NavRight>
                        <Link sheetClose='#edit-sheet'>
                            {Device.ios ? 
                                <SvgIcon symbolId={IconExpandDownIos.id} className={'icon icon-svg'} /> :
                                <SvgIcon symbolId={IconExpandDownAndroid.id} className={'icon icon-svg white'} />
                            }
                        </Link>
                    </NavRight>
                }
            </Navbar>
            <List>
                <ListItem title={_t.textInline} radio checked={wrapType === 'inline'} onClick={() => {props.onWrapType('inline')}}>
                    {!isAndroid && 
                        <SvgIcon slot="media" symbolId={IconWrapInline.id} className={'icon icon-svg'} />
                    }
                </ListItem>
                <ListItem title={_t.textSquare} radio checked={wrapType === 'square'} onClick={() => {props.onWrapType('square')}}>
                    {!isAndroid && 
                        <SvgIcon slot="media" symbolId={IconWrapSquare.id} className={'icon icon-svg'} />
                    }
                </ListItem>
                <ListItem title={_t.textTight} radio checked={wrapType === 'tight'} onClick={() => {props.onWrapType('tight')}}>
                    {!isAndroid && 
                        <SvgIcon slot="media" symbolId={IconWrapTight.id} className={'icon icon-svg'} />
                    }
                </ListItem>
                <ListItem title={_t.textThrough} radio checked={wrapType === 'through'} onClick={() => {props.onWrapType('through')}}>
                    {!isAndroid && 
                        <SvgIcon slot="media" symbolId={IconWrapThrough.id} className={'icon icon-svg'} />
                    }
                </ListItem>
                <ListItem title={_t.textTopAndBottom} radio checked={wrapType === 'top-bottom'} onClick={() => {props.onWrapType('top-bottom')}}>
                    {!isAndroid && 
                        <SvgIcon slot="media" symbolId={IconWrapTopBottom.id} className={'icon icon-svg'} />
                    }
                </ListItem>
                <ListItem title={_t.textInFront} radio checked={wrapType === 'infront'} onClick={() => {props.onWrapType('infront')}}>
                    {!isAndroid && 
                        <SvgIcon slot="media" symbolId={IconWrapInFront.id} className={'icon icon-svg'} />
                    }
                </ListItem>
                <ListItem title={_t.textBehind} radio checked={wrapType === 'behind'} onClick={() => {props.onWrapType('behind')}}>
                    {!isAndroid && 
                        <SvgIcon slot="media" symbolId={IconWrapBehind.id} className={'icon icon-svg'} />
                    }
                </ListItem>
            </List>
            {
                wrapType !== 'inline' &&
                <Fragment>
                    <BlockTitle>{_t.textAlign}</BlockTitle>
                    <List>
                        <ListItem className='buttons'>
                            <div className="row">
                                <a className={'button' + (align === Asc.c_oAscAlignH.Left ? ' active' : '')}
                                   onClick={() => {
                                       props.onAlign(Asc.c_oAscAlignH.Left)
                                   }}>
                                    <SvgIcon slot="media" symbolId={IconBlockAlignLeft.id} className={'icon icon-svg'} />
                                </a>
                                <a className={'button' + (align === Asc.c_oAscAlignH.Center ? ' active' : '')}
                                   onClick={() => {
                                       props.onAlign(Asc.c_oAscAlignH.Center)
                                   }}>
                                    <SvgIcon slot="media" symbolId={IconBlockAlignCenter.id} className={'icon icon-svg'} />
                                </a>
                                <a className={'button' + (align === Asc.c_oAscAlignH.Right ? ' active' : '')}
                                   onClick={() => {
                                       props.onAlign(Asc.c_oAscAlignH.Right)
                                   }}>
                                    <SvgIcon slot="media" symbolId={IconBlockAlignRight.id} className={'icon icon-svg'} />
                                </a>
                            </div>
                        </ListItem>
                    </List>
                </Fragment>
            }
            <List>
                <ListItem title={_t.textMoveWithText} className={'inline' === wrapType ? 'disabled' : ''}>
                    <Toggle checked={moveText} onToggleChange={() => {props.onMoveText(!moveText)}}/>
                </ListItem>
                <ListItem title={_t.textAllowOverlap}>
                    <Toggle checked={overlap} onToggleChange={() => {props.onOverlap(!overlap)}}/>
                </ListItem>
            </List>
            {
                ('behind' !== wrapType && 'infront' !== wrapType) &&
                <Fragment>
                    <BlockTitle>{_t.textDistanceFromText}</BlockTitle>
                    <List>
                        <ListItem>
                            <div slot='inner' style={{width: '100%'}}>
                                <Range min={0} max={200} step={1} value={stateDistance}
                                       onRangeChange={(value) => {setDistance(value)}}
                                       onRangeChanged={(value) => {props.onWrapDistance(value)}}
                                ></Range>
                            </div>
                            <div className='range-number' slot='inner-end'>
                                {stateDistance + ' ' + metricText}
                            </div>
                        </ListItem>
                    </List>
                </Fragment>
            }
        </Page>
    )
};

const PageReorder = props => {
    const { t } = useTranslation();
    const _t = t('Edit', {returnObjects: true});
    const chartObject = props.storeFocusObjects.chartObject;
    if (!chartObject && Device.phone) {
        $$('.sheet-modal.modal-in').length > 0 && f7.sheet.close();
        return null;
    }
    return (
        <Page>
            <Navbar title={t('Edit.textArrange')} backLink={_t.textBack}>
                {Device.phone &&
                    <NavRight>
                        <Link sheetClose='#edit-sheet'>
                            {Device.ios ? 
                                <SvgIcon symbolId={IconExpandDownIos.id} className={'icon icon-svg'} /> :
                                <SvgIcon symbolId={IconExpandDownAndroid.id} className={'icon icon-svg white'} />
                            }
                        </Link>
                    </NavRight>
                }
            </Navbar>
            <List>
                <ListItem title={_t.textBringToForeground} onClick={() => {props.onReorder('all-up')}} link='#' className='no-indicator'>
                    <SvgIcon slot="media" symbolId={IconMoveForeground.id} className={'icon icon-svg'} />
                </ListItem>
                <ListItem title={_t.textSendToBackground} onClick={() => {props.onReorder('all-down')}} link='#' className='no-indicator'>
                    <SvgIcon slot="media" symbolId={IconMoveBackground.id} className={'icon icon-svg'} />
                </ListItem>
                <ListItem title={_t.textMoveForward} onClick={() => {props.onReorder('move-up')}} link='#' className='no-indicator'>
                    <SvgIcon slot="media" symbolId={IconMoveForward.id} className={'icon icon-svg'} />
                </ListItem>
                <ListItem title={_t.textMoveBackward} onClick={() => {props.onReorder('move-down')}} link='#' className='no-indicator'>
                     <SvgIcon slot="media"symbolId={IconMoveBackward.id} className={'icon icon-svg'} />
                </ListItem>
            </List>
        </Page>
    )
};

const EditChart = props => {
    const { t } = useTranslation();

    return (
        <Fragment>
            <List>
                <ListItem title={t('Edit.textDesign')} link='/edit-chart-design/' routeProps={{
                    onType: props.onType,
                    onStyle: props.onStyle,
                    onFillColor: props.onFillColor,
                    onBorderColor: props.onBorderColor,
                    onBorderSize: props.onBorderSize
                }}></ListItem>
                <ListItem title={t('Edit.textWrap')} link='/edit-chart-wrap/' routeProps={{
                    onWrapType: props.onWrapType,
                    onAlign: props.onAlign,
                    onMoveText: props.onMoveText,
                    onOverlap: props.onOverlap,
                    onWrapDistance: props.onWrapDistance
                }}></ListItem>
                <ListItem title={t('Edit.textArrange')} link='/edit-chart-reorder/' routeProps={{
                    onReorder: props.onReorder
                }}></ListItem>
            </List>
            <List className="buttons-list">
                <ListButton title={t('Edit.textRemoveChart')} onClick={() => {props.onRemoveChart()}} className='button-red button-fill button-raised'/>
            </List>
        </Fragment>
    )
};

const PageChartDesign = inject("storeChartSettings", "storeFocusObjects")(observer(PageDesign));
const PageChartDesignType = inject("storeChartSettings", "storeFocusObjects")(observer(PageChartType));
const PageChartDesignStyle = inject("storeChartSettings")(observer(PageChartStyle));
const PageChartDesignBorder = inject("storeChartSettings", "storeFocusObjects")(observer(PageChartBorder));
const PageChartWrap = inject("storeChartSettings", "storeFocusObjects")(observer(PageWrap));
const PageChartReorder = inject("storeFocusObjects")(observer(PageReorder));
const PageChartCustomFillColor = inject("storeChartSettings", "storePalette")(observer(PageCustomFillColor));
const PageChartBorderColor = inject("storeChartSettings", "storePalette")(observer(PageBorderColor));
const PageChartCustomBorderColor = inject("storeChartSettings", "storePalette")(observer(PageCustomBorderColor));

export {EditChart,
        PageChartDesign,
        PageChartDesignType,
        PageChartDesignStyle,
        PageChartDesignFill,
        PageChartDesignBorder,
        PageChartCustomFillColor,
        PageChartBorderColor,
        PageChartCustomBorderColor,
        PageChartWrap,
        PageChartReorder}