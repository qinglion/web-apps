/*
 * (c) Copyright Ascensio System SIA 2010-2024
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-6 Ernesta Birznieka-Upish
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */
/**
 *  ImageSettings.js
 *
 *  Created on 2/05/14
 *
 */

define([
    'text!documenteditor/main/app/template/ImageSettings.template',
    'jquery',
    'underscore',
    'backbone',
    'common/main/lib/component/Button'
], function (menuTemplate, $, _, Backbone) {
    'use strict';

    DE.Views.ImageSettings = Backbone.View.extend(_.extend({
        el: '#id-image-settings',

        // Compile our stats template
        template: _.template(menuTemplate),

        // Delegated events for creating new items, and clearing completed ones.
        events: {
        },

        options: {
            alias: 'ImageSettings'
        },

        initialize: function () {
            this._initSettings = true;

            this._state = {
                WrappingStyle: Asc.c_oAscWrapStyle2.Inline,
                CanBeFlow: true,
                Width: 0,
                Height: 0,
                FromGroup: false,
                DisabledControls: false,
                isOleObject: false,
                cropMode: false,
                isPictureControl: false
            };
            this.lockedControls = [];
            this._locked = false;

            this._originalProps = null;

            this.render();
        },

        render: function () {
            var el = this.$el || $(this.el);
            el.html(this.template({
                scope: this
            }));

            this.labelWidth = el.find('#image-label-width');
            this.labelHeight = el.find('#image-label-height');
            this.ResetCrop = el.find('#image-button-reset-crop').closest('tr');
        },

        setApi: function(api) {
            this.api = api;
            if (this.api) {
                this.api.asc_registerCallback('asc_onImgWrapStyleChanged', _.bind(this._ImgWrapStyleChanged, this));
                this.api.asc_registerCallback('asc_ChangeCropState', _.bind(this._changeCropState, this));
            }
            Common.NotificationCenter.on('storage:image-insert', _.bind(this.insertImageFromStorage, this));

            return this;
        },

        setMode: function(mode) {
            this.mode = mode;
        },

        updateMetricUnit: function() {
            var value = Common.Utils.Metric.fnRecalcFromMM(this._state.Width);
            this.labelWidth[0].innerHTML = this.textWidth + ': ' + value.toFixed(2) + ' ' + Common.Utils.Metric.getCurrentMetricName();

            value = Common.Utils.Metric.fnRecalcFromMM(this._state.Height);
            this.labelHeight[0].innerHTML = this.textHeight + ': ' + value.toFixed(2) + ' ' + Common.Utils.Metric.getCurrentMetricName();
        },

        createDelayedControls: function() {
            var me = this,
                viewData = [
                { icon: 'btn-wrap-inline',      data: Asc.c_oAscWrapStyle2.Inline,      tip: this.txtInline, selected: true },
                { icon: 'btn-wrap-square',      data: Asc.c_oAscWrapStyle2.Square,      tip: this.txtSquare },
                { icon: 'btn-wrap-tight',       data: Asc.c_oAscWrapStyle2.Tight,       tip: this.txtTight },
                { icon: 'btn-wrap-through',     data: Asc.c_oAscWrapStyle2.Through,     tip: this.txtThrough },
                { icon: 'btn-wrap-topbottom',   data: Asc.c_oAscWrapStyle2.TopAndBottom, tip: this.txtTopAndBottom },
                { icon: 'btn-wrap-infront',     data: Asc.c_oAscWrapStyle2.InFront,     tip: this.txtInFront },
                { icon: 'btn-wrap-behind',      data: Asc.c_oAscWrapStyle2.Behind,      tip: this.txtBehind }
            ];

            this.cmbWrapType = new Common.UI.ComboDataView({
                itemWidth: 50,
                itemHeight: 50,
                menuMaxHeight: 300,
                enableKeyEvents: true,
                store: new Common.UI.DataViewStore(viewData),
                cls: 'combo-chart-style',
                dataHint: '1',
                dataHintDirection: 'bottom',
                dataHintOffset: '-10, 0',
                delayRenderTips: true,
                fillOnChangeVisibility: true,
                itemTemplate: _.template([
                    '<div class="item-icon-box" id="<%= id %>" style="">',
                        '<img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" ' +
                            'class="combo-wrap-item options__icon options__icon-huge <%= icon %>"',
                    '</div>'
                ].join('')),
                ariaLabel: this.textWrap
            });
            this.cmbWrapType.render($('#image-combo-wrap'));
            this.cmbWrapType.on('click', _.bind(this.onSelectWrap, this));
            this.cmbWrapType.openButton.menu.on('show:after', function () {
                me.cmbWrapType.menuPicker.scroller.update({alwaysVisibleY: true});
            });
            this.lockedControls.push(this.cmbWrapType);

            this.btnOriginalSize = new Common.UI.Button({
                el: $('#image-button-original-size')
            });
            this.lockedControls.push(this.btnOriginalSize);

            this.btnFitMargins = new Common.UI.Button({
                el: $('#image-button-fit-margins')
            });
            this.lockedControls.push(this.btnFitMargins);

            var w = Math.max(this.btnOriginalSize.cmpEl.width(), this.btnFitMargins.cmpEl.width());
            this.btnOriginalSize.cmpEl.width(w);
            this.btnFitMargins.cmpEl.width(w);

            this.btnEditObject = new Common.UI.Button({
                el: $('#image-button-edit-object')
            });
            this.lockedControls.push(this.btnEditObject);

            this.btnOriginalSize.on('click', _.bind(this.setOriginalSize, this));

            this.btnEditObject.on('click', _.bind(function(btn){
                if (!Common.Controllers.LaunchController.isScriptLoaded()) return;
                if (this.api) {
                    var oleobj = this.api.asc_canEditTableOleObject(true);
                    if (oleobj) {
                        var oleEditor = DE.getController('Common.Controllers.ExternalOleEditor').getView('Common.Views.ExternalOleEditor');
                        if (oleEditor) {
                            oleEditor.setEditMode(true);
                            oleEditor.show();
                            oleEditor.setOleData(Asc.asc_putBinaryDataToFrameFromTableOleObject(oleobj));
                        }
                    } else
                        this.api.asc_startEditCurrentOleObject();
                }
                this.fireEvent('editcomplete', this);
            }, this));
            this.btnFitMargins.on('click', _.bind(this.setFitMargins, this));

            this.btnRotate270 = new Common.UI.Button({
                parentEl: $('#image-button-270', me.$el),
                cls: 'btn-toolbar',
                iconCls: 'toolbar__icon btn-rotate-270',
                value: 0,
                hint: this.textHint270,
                dataHint: '1',
                dataHintDirection: 'bottom',
                dataHintOffset: 'small'
            });
            this.btnRotate270.on('click', _.bind(this.onBtnRotateClick, this));
            this.lockedControls.push(this.btnRotate270);

            this.btnRotate90 = new Common.UI.Button({
                parentEl: $('#image-button-90', me.$el),
                cls: 'btn-toolbar',
                iconCls: 'toolbar__icon btn-rotate-90',
                value: 1,
                hint: this.textHint90,
                dataHint: '1',
                dataHintDirection: 'bottom',
                dataHintOffset: 'small'
            });
            this.btnRotate90.on('click', _.bind(this.onBtnRotateClick, this));
            this.lockedControls.push(this.btnRotate90);

            this.btnFlipV = new Common.UI.Button({
                parentEl: $('#image-button-flipv', me.$el),
                cls: 'btn-toolbar',
                iconCls: 'toolbar__icon btn-flip-vert',
                value: 0,
                hint: this.textHintFlipV,
                dataHint: '1',
                dataHintDirection: 'bottom',
                dataHintOffset: 'small'
            });
            this.btnFlipV.on('click', _.bind(this.onBtnFlipClick, this));
            this.lockedControls.push(this.btnFlipV);

            this.btnFlipH = new Common.UI.Button({
                parentEl: $('#image-button-fliph', me.$el),
                cls: 'btn-toolbar',
                iconCls: 'toolbar__icon btn-flip-hor',
                value: 1,
                hint: this.textHintFlipH,
                dataHint: '1',
                dataHintDirection: 'bottom',
                dataHintOffset: 'small'
            });
            this.btnFlipH.on('click', _.bind(this.onBtnFlipClick, this));
            this.lockedControls.push(this.btnFlipH);

            var w = this.btnOriginalSize.cmpEl.outerWidth();
            this.btnCrop = new Common.UI.Button({
                parentEl: $('#image-button-crop'),
                cls: 'btn-text-split-default',
                caption: this.textCrop,
                split: true,
                enableToggle: true,
                allowDepress: true,
                pressed: this._state.cropMode,
                width: w,
                menu        : new Common.UI.Menu({
                    style       : 'min-width:' + w + 'px;',
                    items: [
                        {
                            caption: this.textCrop,
                            checkable: true,
                            allowDepress: true,
                            checked: this._state.cropMode,
                            value: 0
                        },
                        {
                            caption:  this.textCropToShape,
                            menu: new Common.UI.Menu({
                                menuAlign: 'tl-tl',
                                cls: 'menu-shapes menu-change-shape',
                                items: []
                            })
                        },
                        {
                            caption: this.textCropFill,
                            value: 1
                        },
                        {
                            caption: this.textCropFit,
                            value: 2
                        }]
                }),
                dataHint: '1',
                dataHintDirection: 'bottom',
                dataHintOffset: 'big',
                ariaLabel: this.textCrop
            });
            this.btnCrop.on('click', _.bind(this.onCrop, this));
            this.btnCrop.menu.on('item:click', _.bind(this.onCropMenu, this));
            this.lockedControls.push(this.btnCrop);
            this.btnChangeShape= this.btnCrop.menu.items[1];

            this.btnResetCrop = new Common.UI.Button({
                parentEl: $('#image-button-reset-crop'),
                cls: 'btn-toolbar align-left',
                caption: this.textResetCrop,
                iconCls: 'toolbar__icon btn-reset',
                style: "min-width:100px",       
                dataHint: '1',
                dataHintDirection: 'bottom',
                dataHintOffset: 'big',
                ariaLabel: this.textResetCrop
            });
            this.btnResetCrop.on('click', _.bind(this.onResetCrop, this));
            this.lockedControls.push(this.btnResetCrop);

            this.numTransparency = new Common.UI.MetricSpinner({
                el: $('#image-spin-transparency'),
                step: 1,
                width: 62,
                value: '100 %',
                defaultUnit : "%",
                maxValue: 100,
                minValue: 0,
                dataHint: '1',
                dataHintDirection: 'bottom',
                dataHintOffset: 'big',
                ariaLabel: this.strTransparency
            });
            this.numTransparency.on('change', _.bind(this.onNumTransparencyChange, this));
            this.numTransparency.on('inputleave', function(){ this.fireEvent('editcomplete', this);});
            this.lockedControls.push(this.numTransparency);

            this.sldrTransparency = new Common.UI.SingleSlider({
                el: $('#image-slider-transparency'),
                width: 75,
                minValue: 0,
                maxValue: 100,
                value: 100
            });
            this.sldrTransparency.on('change', _.bind(this.onTransparencyChange, this));
            this.sldrTransparency.on('changecomplete', _.bind(this.onTransparencyChangeComplete, this));
            this.lockedControls.push(this.sldrTransparency);

            this.lblTransparencyStart = $(this.el).find('#image-lbl-transparency-start');
            this.lblTransparencyEnd = $(this.el).find('#image-lbl-transparency-end');
            
            this.btnSelectImage = new Common.UI.Button({
                parentEl: $('#image-button-replace'),
                cls: 'btn-text-menu-default',
                caption: this.textInsert,
                style: "width:100%;",
                menu: new Common.UI.Menu({
                    style: 'min-width: 194px;',
                    maxHeight: 200,
                    items: [
                        {caption: this.textFromFile, value: 0},
                        {caption: this.textFromUrl, value: 1},
                        {caption: this.textFromStorage, value: 2}
                    ]
                }),
                dataHint: '1',
                dataHintDirection: 'bottom',
                dataHintOffset: 'big'
            });
            this.lockedControls.push(this.btnSelectImage);
            this.btnSelectImage.menu.on('item:click', _.bind(this.onImageSelect, this));
            this.btnSelectImage.menu.items[2].setVisible(this.mode.canRequestInsertImage || this.mode.fileChoiceUrl && this.mode.fileChoiceUrl.indexOf("{documentType}")>-1);

            this.linkAdvanced = $('#image-advanced-link');
            $(this.el).on('click', '#image-advanced-link', _.bind(this.openAdvancedSettings, this));
        },

        _changeCropState: function(state) {
            this._state.cropMode = state;

            if (!this.btnCrop) return;
            this.btnCrop.toggle(state, true);
            this.btnCrop.menu.items[0].setChecked(state, true);
        },

        createDelayedElements: function() {
            this.createDelayedControls();
            this.updateMetricUnit();
            this.onApiAutoShapes();
            this._initSettings = false;
        },

        onApiAutoShapes: function() {
            var me = this;
            var onShowBefore = function(menu) {
                me.fillAutoShapes();
                menu.off('show:before', onShowBefore);
            };
            me.btnChangeShape.menu.on('show:before', onShowBefore);
        },

        fillAutoShapes: function() {
            var me = this,
                recents = Common.localStorage.getItem('de-recent-shapes');
            
             var menuitem = new Common.UI.MenuItem({
                    template: _.template('<div id="id-img-change-shape-menu" class="menu-insertshape"></div>'),
                    index: 0
                });
                me.btnChangeShape.menu.addItem(menuitem);

                var shapePicker = new Common.UI.DataViewShape({
                    el: $('#id-img-change-shape-menu'),
                    itemTemplate: _.template('<div class="item-shape" id="<%= id %>"><svg width="20" height="20" class=\"icon uni-scale\"><use xlink:href=\"#svg-icon-<%= data.shapeType %>\"></use></svg></div>'),
                    groups: me.application.getCollection('ShapeGroups'),
                    parentMenu: me.btnChangeShape.menu,
                    restoreHeight: 652,
                    textRecentlyUsed: me.textRecentlyUsed,
                    recentShapes: recents ? JSON.parse(recents) : null,
                    hideTextRect: true,
                    hideLines: true
                });
                shapePicker.on('item:click', function(picker, item, record, e) {
                    if (me.api) {
                        me.api.ChangeShapeType(record.get('data').shapeType);
                        me.fireEvent('editcomplete', me);
                    }
                    if (e.type !== 'click')
                        me.btnCrop.menu.hide();
                });
        },

        ChangeSettings: function(props) {
            if (this._initSettings)
                this.createDelayedElements();

            this.disableControls(this._locked);

            if (props ){

                this._originalProps = new Asc.asc_CImgProperty(props);

                var value = props.get_WrappingStyle();
                if (this._state.WrappingStyle!==value) {
                    this.cmbWrapType.suspendEvents();
                    var rec = this.cmbWrapType.menuPicker.store.findWhere({
                        data: value
                    });
                    this.cmbWrapType.menuPicker.selectRecord(rec);
                    this.cmbWrapType.resumeEvents();
                    this._state.WrappingStyle=value;
                }

                value = props.get_CanBeFlow() && !this._locked;
                var fromgroup = props.get_FromGroup() || this._locked;
                var control_props = this.api.asc_IsContentControl() ? this.api.asc_GetContentControlProperties() : null,
                    isPictureControl = !!control_props && (control_props.get_SpecificType()==Asc.c_oAscContentControlSpecificType.Picture) && !control_props.get_FormPr() || this._locked;
                this.cmbWrapType.setDisabled(!value || fromgroup || isPictureControl);
                this._state.CanBeFlow=value;
                this._state.FromGroup=fromgroup;
                this._state.isPictureControl=isPictureControl;

                value = props.get_Width();
                if ( Math.abs(this._state.Width-value)>0.001 ) {
                    this.labelWidth[0].innerHTML = this.textWidth + ': ' + Common.Utils.Metric.fnRecalcFromMM(value).toFixed(2) + ' ' + Common.Utils.Metric.getCurrentMetricName();
                    this._state.Width = value;
                }

                value = props.get_Height();
                if ( Math.abs(this._state.Height-value)>0.001 ) {
                    this.labelHeight[0].innerHTML = this.textHeight + ': ' + Common.Utils.Metric.fnRecalcFromMM(value).toFixed(2) + ' ' + Common.Utils.Metric.getCurrentMetricName();
                    this._state.Height = value;
                }

                this.ResetCrop.toggleClass('hidden', !props.asc_getIsCrop());
                this.btnResetCrop.setDisabled(!props.asc_getIsCrop() || this._locked);
                this.btnOriginalSize.setDisabled(props.get_ImageUrl()===null || props.get_ImageUrl()===undefined || this._locked);

                var pluginGuid = props.asc_getPluginGuid();
                value = (pluginGuid !== null && pluginGuid !== undefined);
                if (this._state.isOleObject!==value) {
                    this.btnSelectImage.setVisible(!value);
                    this.btnEditObject.setVisible(value);
                    this._state.isOleObject=value;
                }
                this.btnRotate270.setDisabled(value || this._locked);
                this.btnRotate90.setDisabled(value || this._locked);
                this.btnFlipV.setDisabled(value || this._locked);
                this.btnFlipH.setDisabled(value || this._locked);
                this.numTransparency.setDisabled(value || this._locked);
                this.sldrTransparency.setDisabled(value || this._locked);

                if (this._state.isOleObject) {
                    var plugin = DE.getCollection('Common.Collections.Plugins').findWhere({guid: pluginGuid});
                    this.btnEditObject.setDisabled(!this.api.asc_canEditTableOleObject() && (plugin===null || plugin ===undefined) || this._locked);
                } else {
                    this.btnSelectImage.setDisabled(pluginGuid===null || this._locked);
                }

                var transparency = props.asc_getTransparent();
                if (Math.abs(this._state.Transparency - transparency) > 0.001 || 
                    Math.abs(this.numTransparency.getNumberValue() - transparency) > 0.001 || 
                    (this._state.Transparency === null || transparency === null) && 
                    (this._state.Transparency !== transparency || this.numTransparency.getNumberValue() !== transparency)) {
        
                    if (transparency !== undefined) {
                        this.sldrTransparency.setValue((transparency === null) ? 100 : transparency / 255 * 100, true);
                        this.numTransparency.setValue(this.sldrTransparency.getValue(), true);
                    }
                    this._state.Transparency = transparency;
                }
            }
        },

        _ImgWrapStyleChanged: function(style) {
            if (!this.cmbWrapType) return;
            if (this._state.WrappingStyle!==style) {
                this.cmbWrapType.suspendEvents();
                var rec = this.cmbWrapType.menuPicker.store.findWhere({
                    data: style
                });
                this.cmbWrapType.menuPicker.selectRecord(rec);
                this.cmbWrapType.resumeEvents();
                this._state.WrappingStyle=style;
            }
        },

        onSelectWrap: function(combo, record){
            if (this.api) {
                var props = new Asc.asc_CImgProperty(),
                    data = record.get('data');
                props.put_WrappingStyle(data);
                if (this._state.WrappingStyle===Asc.c_oAscWrapStyle2.Inline && data!==Asc.c_oAscWrapStyle2.Inline ) {
                    props.put_PositionH(new Asc.CImagePositionH());
                    props.get_PositionH().put_UseAlign(false);
                    props.get_PositionH().put_RelativeFrom(Asc.c_oAscRelativeFromH.Column);
                    var val = this._originalProps.get_Value_X(Asc.c_oAscRelativeFromH.Column);
                    props.get_PositionH().put_Value(val);

                    props.put_PositionV(new Asc.CImagePositionV());
                    props.get_PositionV().put_UseAlign(false);
                    props.get_PositionV().put_RelativeFrom(Asc.c_oAscRelativeFromV.Paragraph);
                    val = this._originalProps.get_Value_Y(Asc.c_oAscRelativeFromV.Paragraph);
                    props.get_PositionV().put_Value(val);
                }

                this.api.ImgApply(props);
            }

            this.fireEvent('editcomplete', this);
        },

        setOriginalSize:  function() {
            if (this.api) {
                var imgsize = this.api.asc_getCropOriginalImageSize();
                var w = imgsize.get_ImageWidth();
                var h = imgsize.get_ImageHeight();

                this.labelWidth[0].innerHTML = this.textWidth + ': ' + Common.Utils.Metric.fnRecalcFromMM(w).toFixed(2) + ' ' + Common.Utils.Metric.getCurrentMetricName();
                this.labelHeight[0].innerHTML = this.textHeight + ': ' + Common.Utils.Metric.fnRecalcFromMM(h).toFixed(2) + ' ' + Common.Utils.Metric.getCurrentMetricName();

                var properties = new Asc.asc_CImgProperty();
                properties.put_Width(w);
                properties.put_Height(h);
                properties.put_Rot(0);
                this.api.ImgApply(properties);
                this.fireEvent('editcomplete', this);
            }
        },

        setFitMargins:  function() {
            if (this.api) {
                var section = this.api.asc_GetSectionProps(),
                    ratio = (this._state.Height>0) ? this._state.Width/this._state.Height : 1,
                    pagew = (this.api.asc_GetCurrentColumnWidth) ? this.api.asc_GetCurrentColumnWidth() : (section.get_W() - section.get_LeftMargin() - section.get_RightMargin()),
                    pageh = section.get_H() - section.get_TopMargin() - section.get_BottomMargin(),
                    pageratio = pagew/pageh,
                    w, h;

                if (ratio>pageratio) {
                    w = pagew;
                    h = w/ratio;
                } else if (ratio<pageratio) {
                    h = pageh;
                    w = h * ratio;
                } else {
                    w = pagew;
                    h = pageh;
                }

                this.labelWidth[0].innerHTML = this.textWidth + ': ' + Common.Utils.Metric.fnRecalcFromMM(w).toFixed(2) + ' ' + Common.Utils.Metric.getCurrentMetricName();
                this.labelHeight[0].innerHTML = this.textHeight + ': ' + Common.Utils.Metric.fnRecalcFromMM(h).toFixed(2) + ' ' + Common.Utils.Metric.getCurrentMetricName();

                var properties = new Asc.asc_CImgProperty();
                properties.put_Width(w);
                properties.put_Height(h);

                if (this._state.WrappingStyle!==Asc.c_oAscWrapStyle2.Inline) {
                    if (ratio>=1) {
                        var position = new Asc.CImagePositionH();
                        position.put_UseAlign(true);
                        position.put_Percent(false);
                        position.put_RelativeFrom(Asc.c_oAscRelativeFromH.Margin);
                        position.put_Align(Asc.c_oAscAlignH.Left);
                        properties.put_PositionH(position);
                    }
                    if (ratio<=1) {
                        position = new Asc.CImagePositionV();
                        position.put_UseAlign(true);
                        position.put_Percent(false);
                        position.put_RelativeFrom(Asc.c_oAscRelativeFromV.Margin);
                        position.put_Align(Asc.c_oAscAlignV.Top);
                        properties.put_PositionV(position);
                    }
                }

                this.api.ImgApply(properties);
                this.fireEvent('editcomplete', this);
            }
        },

        setImageUrl: function(url, token) {
            var props = new Asc.asc_CImgProperty();
            props.put_ImageUrl(url, token);
            this.api.ImgApply(props);
        },

        insertImageFromStorage: function(data) {
            if (data && data._urls && data.c=='change') {
                this.setImageUrl(data._urls[0], data.token);
            }
        },

        onImageSelect: function(menu, item) {
            if (item.value==1) {
                var me = this;
                (new Common.Views.ImageFromUrlDialog({
                    handler: function(result, value) {
                        if (result == 'ok') {
                            if (me.api) {
                                var checkUrl = value.replace(/ /g, '');
                                if (!_.isEmpty(checkUrl)) {
                                    me.setImageUrl(checkUrl);
                                }
                            }
                        }
                        me.fireEvent('editcomplete', me);
                    }
                })).show();
            } else if (item.value==2) {
                Common.NotificationCenter.trigger('storage:image-load', 'change');
            } else {
                if (this._isFromFile) return;
                this._isFromFile = true;
                if (this.api) this.api.ChangeImageFromFile();
                this.fireEvent('editcomplete', this);
                this._isFromFile = false;
            }
        },

        onBtnRotateClick: function(btn) {
            var properties = new Asc.asc_CImgProperty();
            properties.asc_putRotAdd((btn.options.value==1 ? 90 : 270) * 3.14159265358979 / 180);
            this.api.ImgApply(properties);
            this.fireEvent('editcomplete', this);
        },

        onBtnFlipClick: function(btn) {
            var properties = new Asc.asc_CImgProperty();
            if (btn.options.value==1)
                properties.asc_putFlipHInvert(true);
            else
                properties.asc_putFlipVInvert(true);
            this.api.ImgApply(properties);
            this.fireEvent('editcomplete', this);
        },

        onCrop: function(btn, e) {
            if (this.api) {
                btn.pressed ? this.api.asc_startEditCrop() : this.api.asc_endEditCrop();
            }
            this.fireEvent('editcomplete', this);
        },

        onCropMenu: function(menu, item) {
            if (this.api) {
                if (item.value == 1) {
                    this.api.asc_cropFill();
                } else if (item.value == 2) {
                    this.api.asc_cropFit();
                } else {
                    item.checked ? this.api.asc_startEditCrop() : this.api.asc_endEditCrop();
                }
            }
            this.fireEvent('editcomplete', this);
        },

        openAdvancedSettings: function(e) {
            if (this.linkAdvanced.hasClass('disabled')) return;

            var me = this;
            var win;
            if (me.api && !this._locked){
                var selectedElements = me.api.getSelectedElements();
                if (selectedElements && selectedElements.length>0){
                    var elType, elValue;
                    for (var i = selectedElements.length - 1; i >= 0; i--) {
                        elType = selectedElements[i].get_ObjectType();
                        elValue = selectedElements[i].get_ObjectValue();
                        if (Asc.c_oAscTypeSelectElement.Image == elType) {
                            var imgsizeOriginal;
                            if (!me.btnOriginalSize.isDisabled()) {
                                imgsizeOriginal = me.api.asc_getCropOriginalImageSize();
                                if (imgsizeOriginal)
                                    imgsizeOriginal = {width:imgsizeOriginal.get_ImageWidth(), height:imgsizeOriginal.get_ImageHeight()};
                            }
                            (new DE.Views.ImageSettingsAdvanced(
                                {
                                    imageProps: elValue,
                                    sizeOriginal: imgsizeOriginal,
                                    api         : me.api,
                                    sectionProps: me.api.asc_GetSectionProps(),
                                    handler: function(result, value) {
                                        if (result == 'ok') {
                                            if (me.api) {
                                                me.api.ImgApply(value.imageProps);
                                            }
                                        }
                                        me.fireEvent('editcomplete', me);
                                    }
                            })).show();
                            break;
                        }
                    }
                }
            }
        },

        onResetCrop: function() {
            if (this.api) {
                var properties = new Asc.asc_CImgProperty();
                properties.put_ResetCrop(true);
                this.api.ImgApply(properties);
                this.fireEvent('editcomplete', this);
            }
        },

        onNumTransparencyChange: function(field, newValue, oldValue, eOpts){
            this.sldrTransparency.setValue(field.getNumberValue(), true);
            if (this.api)  {
                var num = field.getNumberValue();
                var properties = new Asc.asc_CImgProperty();
                properties.asc_putTransparent(num * 2.55); 
                this.api.ImgApply(properties);
            }
        },

        onTransparencyChange: function(field, newValue, oldValue){
            this._sliderChanged = newValue;
            this.numTransparency.setValue(newValue, true);

            if (this._sendUndoPoint) {
                this.api.setStartPointHistory();
                this._sendUndoPoint = false;
                this.updateslider = setInterval(_.bind(this._transparencyApplyFunc, this), 100);
            }
        },

        onTransparencyChangeComplete: function(field, newValue, oldValue){
            clearInterval(this.updateslider);
            this._sliderChanged = newValue;
            if (!this._sendUndoPoint) { 
                this.api.setEndPointHistory();
                this._transparencyApplyFunc();
            }
            this._sendUndoPoint = true;
        },

         _transparencyApplyFunc: function() {
            if (this._sliderChanged!==undefined) {
                var properties = new Asc.asc_CImgProperty();
                properties.asc_putTransparent(this._sliderChanged * 2.55);
                this.api.ImgApply(properties);
                this._sliderChanged = undefined;
            }
        },

        setLocked: function (locked) {
            this._locked = locked;
        },

        disableControls: function(disable) {
            if (this._initSettings) return;
            
            if (this._state.DisabledControls!==disable) {
                this._state.DisabledControls = disable;
                _.each(this.lockedControls, function(item) {
                    item.setDisabled(disable);
                });
                this.linkAdvanced.toggleClass('disabled', disable);
            }

            this.btnCrop.setDisabled(disable || !this.api.asc_canEditCrop());
        },

        textSize:       'Size',
        textWrap:       'Wraping Style',
        textWidth:      'Width',
        textHeight:     'Height',
        textOriginalSize: 'Actual Size',
        textInsert:     'Replace Image',
        textFromUrl:    'From URL',
        textFromFile:   'From File',
        textAdvanced:   'Show advanced settings',
        txtInline: 'Inline',
        txtSquare: 'Square',
        txtTight: 'Tight',
        txtThrough: 'Through',
        txtTopAndBottom: 'Top and bottom',
        txtBehind: 'Behind',
        txtInFront: 'In front',
        textEditObject: 'Edit Object',
        textEdit:       'Edit',
        textFitMargins: 'Fit to Margin',
        textRotation: 'Rotation',
        textRotate90: 'Rotate 90°',
        textFlip: 'Flip',
        textHint270: 'Rotate 90° Counterclockwise',
        textHint90: 'Rotate 90° Clockwise',
        textHintFlipV: 'Flip Vertically',
        textHintFlipH: 'Flip Horizontally',
        textCrop: 'Crop',
        textCropFill: 'Fill',
        textCropFit: 'Fit',
        textCropToShape: 'Crop to shape',
        textFromStorage: 'From Storage',
        textRecentlyUsed: 'Recently Used'
    }, DE.Views.ImageSettings || {}));
});