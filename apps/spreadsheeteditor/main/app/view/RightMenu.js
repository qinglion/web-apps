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
 *  RightMenu.js
 *
 *  Created on 3/27/14
 *
 */

var SCALE_MIN = 40;
var MENU_SCALE_PART = 260;
var MENU_BASE_WIDTH = 220;

define([
    'text!spreadsheeteditor/main/app/template/RightMenu.template',
    'jquery',
    'underscore',
    'backbone',
    'common/main/lib/component/SideMenu',
    'common/main/lib/component/Button',
    'common/main/lib/component/MetricSpinner',
    'common/main/lib/component/CheckBox',
    'spreadsheeteditor/main/app/view/ParagraphSettings',
    'spreadsheeteditor/main/app/view/ImageSettings',
    'spreadsheeteditor/main/app/view/ChartSettings',
    'spreadsheeteditor/main/app/view/ShapeSettings',
    'spreadsheeteditor/main/app/view/TextArtSettings',
    'spreadsheeteditor/main/app/view/TableSettings',
    'spreadsheeteditor/main/app/view/PivotSettings',
    'spreadsheeteditor/main/app/view/SignatureSettings',
    'spreadsheeteditor/main/app/view/CellSettings',
    'spreadsheeteditor/main/app/view/SlicerSettings',
    'common/main/lib/component/Scroller',
    'common/main/lib/component/ListView',
], function (menuTemplate, $, _, Backbone) {
    'use strict';

    SSE.Views.RightMenu = Common.UI.SideMenu.extend(_.extend({
        el: '#right-menu',

        // Compile our stats template
        template: _.template(menuTemplate),

        // Delegated events for creating new items, and clearing completed ones.
        events: {
        },

        initialize: function () {
            this.minimizedMode = true;

            this.btnText = new Common.UI.Button({
                hint: this.txtParagraphSettings,
                asctype: Common.Utils.documentSettingsType.Paragraph,
                enableToggle: true,
                disabled: true,
                iconCls: 'btn-paragraph',
                toggleGroup: 'tabpanelbtnsGroup',
                allowMouseEventsOnDisabled: true
            });
            this.btnImage = new Common.UI.Button({
                hint: this.txtImageSettings,
                asctype: Common.Utils.documentSettingsType.Image,
                enableToggle: true,
                disabled: true,
                iconCls: 'btn-menu-image',
                toggleGroup: 'tabpanelbtnsGroup',
                allowMouseEventsOnDisabled: true
            });
            this.btnChart = new Common.UI.Button({
                hint: this.txtChartSettings,
                asctype: Common.Utils.documentSettingsType.Chart,
                enableToggle: true,
                disabled: true,
                iconCls: 'btn-menu-chart',
                toggleGroup: 'tabpanelbtnsGroup',
                allowMouseEventsOnDisabled: true
            });
            this.btnShape = new Common.UI.Button({
                hint: this.txtShapeSettings,
                asctype: Common.Utils.documentSettingsType.Shape,
                enableToggle: true,
                disabled: true,
                iconCls: 'btn-menu-shape',
                toggleGroup: 'tabpanelbtnsGroup',
                allowMouseEventsOnDisabled: true
            });

            this.btnTextArt = new Common.UI.Button({
                hint: this.txtTextArtSettings,
                asctype: Common.Utils.documentSettingsType.TextArt,
                enableToggle: true,
                disabled: true,
                iconCls: 'btn-menu-textart',
                toggleGroup: 'tabpanelbtnsGroup',
                allowMouseEventsOnDisabled: true
            });

            this.btnTable = new Common.UI.Button({
                hint: this.txtTableSettings,
                asctype: Common.Utils.documentSettingsType.Table,
                enableToggle: true,
                disabled: true,
                iconCls: 'btn-menu-table',
                toggleGroup: 'tabpanelbtnsGroup',
                allowMouseEventsOnDisabled: true
            });

            this.btnPivot = new Common.UI.Button({
                hint: this.txtPivotSettings,
                asctype: Common.Utils.documentSettingsType.Pivot,
                enableToggle: true,
                disabled: true,
                iconCls: 'btn-pivot-sum',
                visible: false,
                toggleGroup: 'tabpanelbtnsGroup',
                allowMouseEventsOnDisabled: true
            });
            this.btnCell = new Common.UI.Button({
                hint: this.txtCellSettings,
                asctype: Common.Utils.documentSettingsType.Cell,
                enableToggle: true,
                disabled: true,
                iconCls: 'btn-menu-cell',
                toggleGroup: 'tabpanelbtnsGroup',
                allowMouseEventsOnDisabled: true
            });
            this.btnSlicer = new Common.UI.Button({
                hint: this.txtSlicerSettings,
                asctype: Common.Utils.documentSettingsType.Slicer,
                enableToggle: true,
                disabled: true,
                iconCls: 'btn-slicer',
                toggleGroup: 'tabpanelbtnsGroup',
                allowMouseEventsOnDisabled: true
            });

            this._settings = [];
            this._settings[Common.Utils.documentSettingsType.Paragraph]   = {panel: "id-paragraph-settings",  btn: this.btnText};
            this._settings[Common.Utils.documentSettingsType.Image]       = {panel: "id-image-settings",      btn: this.btnImage};
            this._settings[Common.Utils.documentSettingsType.Shape]       = {panel: "id-shape-settings",      btn: this.btnShape};
            this._settings[Common.Utils.documentSettingsType.Chart]       = {panel: "id-chart-settings",      btn: this.btnChart};
            this._settings[Common.Utils.documentSettingsType.TextArt]     = {panel: "id-textart-settings",    btn: this.btnTextArt};
            this._settings[Common.Utils.documentSettingsType.Table]       = {panel: "id-table-settings",      btn: this.btnTable};
            this._settings[Common.Utils.documentSettingsType.Pivot]       = {panel: "id-pivot-settings",      btn: this.btnPivot};
            this._settings[Common.Utils.documentSettingsType.Cell]        = {panel: "id-cell-settings",       btn: this.btnCell};
            this._settings[Common.Utils.documentSettingsType.Slicer]      = {panel: "id-slicer-settings",     btn: this.btnSlicer};

            return this;
        },

        render: function (mode) {
            var el = $(this.el);

            this.trigger('render:before', this);

            this.defaultHideRightMenu = !(mode.customization && (mode.customization.hideRightMenu===false));
            var open = !Common.localStorage.getBool("sse-hide-right-settings", this.defaultHideRightMenu);
            Common.Utils.InternalSettings.set("sse-hide-right-settings", !open);

            Common.NotificationCenter.on('app:repaint', function() {
                el.css('width', ((open) ? MENU_SCALE_PART : SCALE_MIN) + 'px');
            });

            Common.NotificationCenter.on('uitheme:changed', _.bind(function() {
                this.updateWidth();
                Common.NotificationCenter.trigger('layout:changed', 'rightmenu');
            }, this));

            el.html(this.template({scope: this}));

            this.updateWidth();
            el.css('z-index', 101);
            el.show();

            this.btnMoreContainer = $('#slot-right-menu-more');
            Common.UI.SideMenu.prototype.render.call(this);
            this.btnMore.menu.menuAlign = 'tr-tl';

            this.btnText.setElement($('#id-right-menu-text'), false);           this.btnText.render();
            this.btnImage.setElement($('#id-right-menu-image'), false);         this.btnImage.render();
            this.btnChart.setElement($('#id-right-menu-chart'), false);         this.btnChart.render();
            this.btnShape.setElement($('#id-right-menu-shape'), false);         this.btnShape.render();
            this.btnTextArt.setElement($('#id-right-menu-textart'), false);     this.btnTextArt.render();
            this.btnTable.setElement($('#id-right-menu-table'), false);         this.btnTable.render();
            this.btnPivot.setElement($('#id-right-menu-pivot'), false);         this.btnPivot.render();
            this.btnCell.setElement($('#id-right-menu-cell'), false);           this.btnCell.render();
            this.btnSlicer.setElement($('#id-right-menu-slicer'), false);       this.btnSlicer.render();

            this.btnText.on('click',            _.bind(this.onBtnMenuClick, this));
            this.btnImage.on('click',           _.bind(this.onBtnMenuClick, this));
            this.btnChart.on('click',           _.bind(this.onBtnMenuClick, this));
            this.btnShape.on('click',           _.bind(this.onBtnMenuClick, this));
            this.btnTextArt.on('click',         _.bind(this.onBtnMenuClick, this));
            this.btnTable.on('click',           _.bind(this.onBtnMenuClick, this));
            this.btnPivot.on('click',           _.bind(this.onBtnMenuClick, this));
            this.btnCell.on('click',           _.bind(this.onBtnMenuClick, this));
            this.btnSlicer.on('click',         _.bind(this.onBtnMenuClick, this));

            this.paragraphSettings = new SSE.Views.ParagraphSettings();
            this.imageSettings = new SSE.Views.ImageSettings();
            this.chartSettings = new SSE.Views.ChartSettings();
            this.shapeSettings = new SSE.Views.ShapeSettings();
            this.textartSettings = new SSE.Views.TextArtSettings();
            this.tableSettings = new SSE.Views.TableSettings();
            this.pivotSettings = new SSE.Views.PivotSettings();
            this.cellSettings = new SSE.Views.CellSettings();
            this.slicerSettings = new SSE.Views.SlicerSettings();

            if (mode && mode.isSignatureSupport) {
                this.btnSignature = new Common.UI.Button({
                    hint: this.txtSignatureSettings,
                    asctype: Common.Utils.documentSettingsType.Signature,
                    enableToggle: true,
                    disabled: true,
                    iconCls: 'btn-menu-signature',
                    toggleGroup: 'tabpanelbtnsGroup',
                    allowMouseEventsOnDisabled: true
                });
                this._settings[Common.Utils.documentSettingsType.Signature]   = {panel: "id-signature-settings",      btn: this.btnSignature};

                this.btnSignature.setElement($('#id-right-menu-signature'), false); this.btnSignature.render().setVisible(true);
                this.btnSignature.on('click', _.bind(this.onBtnMenuClick, this));
                this.signatureSettings = new SSE.Views.SignatureSettings();
            }

            if (_.isUndefined(this.scroller)) {
                this.scroller = new Common.UI.Scroller({
                    el: $(this.el).find('.right-panel > .content-box'),
                    suppressScrollX: true,
                    useKeyboard: false
                });
            }

            if (open) {
                $('#id-cell-settings').closest('.right-panel').css("display", "inline-block" );
                $('#id-cell-settings').addClass("active");
            }

            this.trigger('render:after', this);

            return this;
        },

        setApi: function(api) {
            var me = this;
            this.api = api;
            var _isEyedropperStart = function (isStart) {this._isEyedropperStart = isStart;};
            var _updateScroller = function () {me.updateScroller();};
            this.paragraphSettings.setApi(api);
            this.imageSettings.setApi(api);
            this.chartSettings.setApi(api).on('updatescroller', _updateScroller);
            this.shapeSettings.setApi(api).on('eyedropper', _.bind(_isEyedropperStart, this)).on('updatescroller', _updateScroller);
            this.textartSettings.setApi(api).on('eyedropper', _.bind(_isEyedropperStart, this)).on('updatescroller', _updateScroller);
            this.tableSettings.setApi(api);
            this.pivotSettings.setApi(api);
            this.cellSettings.setApi(api).on('eyedropper', _.bind(_isEyedropperStart, this));
            this.slicerSettings.setApi(api);
            if (this.signatureSettings) this.signatureSettings.setApi(api);
            return this;
        },

        setMode: function(mode) {
            this.mode = mode;
            this.imageSettings && this.imageSettings.setMode(mode);
            this.shapeSettings && this.shapeSettings.setMode(mode);
            this.tableSettings && this.tableSettings.setMode(mode);
            return this;
        },

        onBtnMenuClick: function(btn, e) {
            var isPlugin = btn && btn.options.type === 'plugin',
                target_pane_parent = $(this.el).find('.right-panel'),
                target_pane;
            if (btn && !isPlugin) {
                target_pane = $("#" + this._settings[btn.options.asctype].panel);
            }

            if (btn && btn.pressed) {
                if ( this.minimizedMode ) {
                    $(this.el).width(MENU_SCALE_PART);
                    target_pane_parent.css("display", "inline-block" );
                    this.minimizedMode = false;
                    Common.localStorage.setItem("sse-hide-right-settings", 0);
                    Common.Utils.InternalSettings.set("sse-hide-right-settings", false);
                }
                target_pane_parent.find('.settings-panel.active').removeClass('active');
                target_pane && target_pane.addClass("active");

                if (this.scroller) {
                    this.scroller.scrollTop(0);
                }
            } else {
                target_pane_parent.css("display", "none" );
                $(this.el).width(SCALE_MIN);
                this.minimizedMode = true;
                Common.localStorage.setItem("sse-hide-right-settings", 1);
                Common.Utils.InternalSettings.set("sse-hide-right-settings", true);
            }

            !isPlugin && $('.right-panel .plugin-panel').toggleClass('active', false);
            btn && !isPlugin && this.fireEvent('rightmenuclick', [this, btn.options.asctype, this.minimizedMode, e]);
        },

        SetActivePane: function(type, open) {
            if (this.minimizedMode && open!==true || this._settings[type]===undefined ) return;

            if (this.minimizedMode) {
                this._settings[type].btn.toggle(true, false);
                this._settings[type].btn.trigger('click', this._settings[type].btn);
            } else {
                var target_pane = $("#" + this._settings[type].panel );
                if ( !target_pane.hasClass('active') ) {
                    target_pane.parent().find('.settings-panel.active').removeClass('active');
                    target_pane.addClass("active");
                    if (this.scroller) {
                        this.scroller.update();
                        this.scroller.scrollTop(0);
                    }
                }
                if (!this._settings[type].btn.isActive())
                    this._settings[type].btn.toggle(true, false);
            }
        },

        GetActivePane: function() {
            var active = this.$el.find(".settings-panel.active");
            return (this.minimizedMode || active.length === 0) ? null : active[0].id;
        },

        clearSelection: function() {
            var target_pane = $(".right-panel");
            target_pane.find('.settings-panel.active').removeClass('active');
            this._settings.forEach(function(item){
                if (item.btn.isActive())
                    item.btn.toggle(false, true);
            });
            target_pane.css("display", "none" );
            $(this.el).width(SCALE_MIN);
            this.minimizedMode = true;
            Common.NotificationCenter.trigger('layout:changed', 'rightmenu');
        },

        updateScroller: function() {
            if (this.scroller) {
                this.scroller.update();
                this.scroller.scrollTop(0);
            }
        },

        setButtons: function () {
            var allButtons = [this.btnCell, this.btnTable, this.btnShape, this.btnImage, this.btnChart, this.btnText, this.btnTextArt, this.btnSlicer, this.btnSignature, this.btnPivot];
            Common.UI.SideMenu.prototype.setButtons.apply(this, [allButtons]);
        },

        updateWidth: function() {
            var pane = $(this.el).find('.right-panel'),
                paddings = parseInt(pane.css('padding-left')) + parseInt(pane.css('padding-right'));
            pane.css('width', MENU_BASE_WIDTH + paddings + 'px');
            MENU_SCALE_PART = SCALE_MIN + MENU_BASE_WIDTH + paddings;
            this.$el.css('width', (!Common.Utils.InternalSettings.get("sse-hide-right-settings") ? MENU_SCALE_PART : SCALE_MIN) + 'px');
        },

        txtParagraphSettings:       'Paragraph Settings',
        txtImageSettings:           'Image Settings',
        txtShapeSettings:           'Shape Settings',
        txtTextArtSettings:         'Text Art Settings',
        txtChartSettings:           'Chart Settings',
        txtSparklineSettings:       'Sparkline Settings',
        txtTableSettings:           'Table Settings',
        txtPivotSettings:           'Pivot Table Settings',
        txtSignatureSettings:       'Signature Settings',
        txtCellSettings:            'Cell Settings',
        txtSlicerSettings:          'Slicer Settings',
        ariaRightMenu:              'Right menu'
    }, SSE.Views.RightMenu || {}));
});