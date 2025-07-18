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
 *    FileMenu.js
 *
 *    Describes menu 'File' for the left tool menu
 *
 *    Created on 14 February 2014
 *
 */

define([
    'text!documenteditor/main/app/template/FileMenu.template',
    'underscore',
    'common/main/lib/component/BaseView',
    'common/main/lib/view/RecentFiles'
], function (tpl, _) {
    'use strict';

    DE.Views.FileMenu = Common.UI.BaseView.extend(_.extend({
        el: '#file-menu-panel',
        rendered: false,
        options: {alias:'FileMenu'},

        template: _.template(tpl),

        events: function() {
            return {
                'click .fm-btn': _.bind(function(event){
                    var $item = $(event.currentTarget);
                    if (!$item.hasClass('active')) {
                        $('.fm-btn',this.el).removeClass('active');
                        $item.addClass('active');
                    }
                    var item = _.findWhere(this.items, {el: event.currentTarget});
                    if (item) {
                        var panel = this.panels[item.options.action];
                        if (item.options.action === 'help') {
                            if ( panel.noHelpContents === true && navigator.onLine ) {
                                this.fireEvent('item:click', [this, 'external-help', true]);
                                const helpCenter = Common.Utils.InternalSettings.get('url-help-center');
                                !!helpCenter && window.open(helpCenter, '_blank');
                                return;
                            }
                        }

                        this.fireEvent('item:click', [this, item.options.action, !!panel]);

                        if (panel) {
                            this.$el.find('.content-box:visible').hide();
                            this.active = item.options.action;
                            panel.show();
                        }
                    }
                }, this)
            };
        },

        initialize: function () {
            this._state = {
                infoPreviewMode: false
            };
        },

        render: function () {
            var $markup = $(this.template({scope: this}));

            this.miClose = new Common.UI.MenuItem({
                el      : $markup.elementById('#fm-btn-return'),
                action  : 'back',
                caption : this.btnCloseMenuCaption,
                canFocused: false,
                dataHint: 1,
                dataHintDirection: 'left-top',
                dataHintOffset: [-2, 22],
                iconCls: 'menu__icon btn-previtem icon-rtl'
            });

            this.miSave = new Common.UI.MenuItem({
                el      : $markup.elementById('#fm-btn-save'),
                action  : 'save',
                caption : this.btnSaveCaption,
                canFocused: false,
                dataHint: 1,
                dataHintDirection: 'left-top',
                dataHintOffset: [-2, 22],
                dataHintTitle: 'S',
                iconCls: 'menu__icon btn-save'
            });

            if ( !!this.options.miSave ) {
                this.miSave.setDisabled(this.options.miSave.isDisabled());
                delete this.options.miSave;
            }

            this.miEdit = new Common.UI.MenuItem({
                el      : $markup.elementById('#fm-btn-edit'),
                action  : 'edit',
                caption : this.btnToEditCaption,
                canFocused: false,
                dataHint: 1,
                dataHintDirection: 'left-top',
                dataHintOffset: [-2, 22],
                iconCls: 'menu__icon btn-edit'
            });

            this.miDownload = new Common.UI.MenuItem({
                el      : $markup.elementById('#fm-btn-download'),
                action  : 'saveas',
                caption : this.btnDownloadCaption,
                canFocused: false,
                dataHint: 1,
                dataHintDirection: 'left-top',
                dataHintOffset: [-2, 22],
                iconCls: 'menu__icon btn-download'
            });

            this.miSaveCopyAs = new Common.UI.MenuItem({
                el      : $markup.elementById('#fm-btn-save-copy'),
                action  : 'save-copy',
                caption : this.btnSaveCopyAsCaption,
                canFocused: false,
                dataHint: 1,
                dataHintDirection: 'left-top',
                dataHintOffset: [-2, 22],
                iconCls: 'menu__icon btn-save-copy'
            });

            this.miSaveAs = new Common.UI.MenuItem({
                el      : $markup.elementById('#fm-btn-save-desktop'),
                action  : 'save-desktop',
                caption : this.btnSaveAsCaption,
                canFocused: false,
                dataHint: 1,
                dataHintDirection: 'left-top',
                dataHintOffset: [2, 14]
            });

            this.miPrintWithPreview = new Common.UI.MenuItem({
                el      : $markup.elementById('#fm-btn-print-with-preview'),
                action  : 'printpreview',
                caption : this.btnPrintCaption,
                canFocused: false,
                dataHint: 1,
                dataHintDirection: 'left-top',
                dataHintOffset: [-2, 22],
                dataHintTitle: 'P',
                iconCls: 'menu__icon btn-print'
            });

            this.miPrint = new Common.UI.MenuItem({
                el      : $markup.elementById('#fm-btn-print'),
                action  : 'print',
                caption : this.btnPrintCaption,
                canFocused: false,
                dataHint: 1,
                dataHintDirection: 'left-top',
                dataHintOffset: [-2, 22],
                dataHintTitle: 'P',
                iconCls: 'menu__icon btn-print'
            });

            this.miRename = new Common.UI.MenuItem({
                el      : $markup.elementById('#fm-btn-rename'),
                action  : 'rename',
                caption : this.btnRenameCaption,
                canFocused: false,
                dataHint: 1,
                dataHintDirection: 'left-top',
                dataHintOffset: [-2, 22],
                iconCls: 'menu__icon btn-rename'
            });

            if ( !!this.options.miRename ) {
                this.miRename.setDisabled(this.options.miRename.isDisabled());
                delete this.options.miRename;
            }

            this.miProtect = new Common.UI.MenuItem({
                el      : $markup.elementById('#fm-btn-protect'),
                action  : 'protect',
                caption : this.btnProtectCaption,
                canFocused: false,
                dataHint: 1,
                dataHintDirection: 'left-top',
                dataHintOffset: [-2, 22],
                iconCls: 'menu__icon btn-lock'
            });

            if ( !!this.options.miProtect ) {
                this.miProtect.setDisabled(this.options.miProtect.isDisabled());
                delete this.options.miProtect;
            }

            this.miRecent = new Common.UI.MenuItem({
                el      : $markup.elementById('#fm-btn-recent'),
                action  : 'recent',
                caption : this.btnRecentFilesCaption,
                canFocused: false,
                dataHint: 1,
                dataHintDirection: 'left-top',
                dataHintOffset: [2, 14]
            });

            this.miNew = new Common.UI.MenuItem({
                el      : $markup.elementById('#fm-btn-create'),
                action  : 'new',
                caption : this.btnCreateNewCaption,
                canFocused: false,
                dataHint: 1,
                dataHintDirection: 'left-top',
                dataHintOffset: [-2, 22],
                iconCls: 'menu__icon btn-create-new'
            });

            this.miInfo = new Common.UI.MenuItem({
                el      : $markup.elementById('#fm-btn-info'),
                action  : 'info',
                caption : this.btnInfoCaption,
                canFocused: false,
                dataHint: 1,
                dataHintDirection: 'left-top',
                dataHintOffset: [-2, 22],
                iconCls: 'menu__icon btn-menu-about'
            });

            this.miAccess = new Common.UI.MenuItem({
                el      : $markup.elementById('#fm-btn-rights'),
                action  : 'rights',
                caption : this.btnRightsCaption,
                canFocused: false,
                dataHint: 1,
                dataHintDirection: 'left-top',
                dataHintOffset: [-2, 22],
                iconCls: 'menu__icon btn-users-share'
            });

            this.miHistory = new Common.UI.MenuItem({
                el      : $markup.elementById('#fm-btn-history'),
                action  : 'history',
                caption : this.btnHistoryCaption,
                canFocused: false,
                dataHint: 1,
                dataHintDirection: 'left-top',
                dataHintOffset: [-2, 22],
                iconCls: 'menu__icon btn-version-history'
            });
            if ( !!this.options.miHistory ) {
                this.miHistory.setDisabled(this.options.miHistory.isDisabled());
                delete this.options.miHistory;
            }

            this.miSettings = new Common.UI.MenuItem({
                el      : $markup.elementById('#fm-btn-settings'),
                action  : 'opts',
                caption : this.btnSettingsCaption,
                canFocused: false,
                dataHint: 1,
                dataHintDirection: 'left-top',
                dataHintOffset: [-2, 22],
                iconCls: 'menu__icon btn-settings'
            });

            this.miHelp = new Common.UI.MenuItem({
                el      : $markup.elementById('#fm-btn-help'),
                action  : 'help',
                caption : this.btnHelpCaption,
                canFocused: false,
                dataHint: 1,
                dataHintDirection: 'left-top',
                dataHintOffset: [-2, 22],
                iconCls: 'menu__icon btn-help'
            });

            this.miBack = new Common.UI.MenuItem({
                el      : $markup.elementById('#fm-btn-back'),
                action  : 'exit',
                caption : this.btnBackCaption,
                canFocused: false,
                dataHint: 1,
                dataHintDirection: 'left-top',
                dataHintOffset: [-2, 22],
                iconCls: 'menu__icon btn-goback'
            });

            this.items = [];
            this.items.push(
                this.miClose,
                this.miSave,
                this.miEdit,
                this.miDownload,
                this.miSaveCopyAs,
                this.miSaveAs,
                this.miPrint,
                this.miPrintWithPreview,
                this.miRename,
                this.miProtect,
                this.miRecent,
                this.miNew,
                this.miInfo,
                this.miAccess,
                this.miHistory,
                this.miSettings,
                this.miHelp,
                this.miBack
            );

            this.rendered = true;
            this.$el.html($markup);
            this.$el.find('.content-box').hide();
            if (_.isUndefined(this.scroller)) {
                var me = this;
                this.scroller = new Common.UI.Scroller({
                    el: this.$el.find('.panel-menu'),
                    suppressScrollX: true,
                    alwaysVisibleY: true
                });
                Common.NotificationCenter.on('window:resize', function() {
                    me.scroller.update();
                });
            }

            this.applyMode();

            if ( Common.Controllers.Desktop.isActive() ) {
                Common.NotificationCenter.trigger('update:recents', Common.Controllers.Desktop.recentFiles());
            }

            if ( !!this.api ) {
                this.panels['info'].setApi(this.api);
                if (this.panels['opts']) this.panels['opts'].setApi(this.api);
                if ( this.panels['protect'] )
                    this.panels['protect'].setApi(this.api);
            }

            this.fireEvent('render:after', [this]);
            return this;
        },

        show: function(panel, opts) {
            if (this.isVisible() && panel===undefined || !this.mode || !Common.Controllers.LaunchController.isScriptLoaded()) return;

            if ( !this.rendered )
                this.render();

            var defPanel = (this.mode.canDownload && (!this.mode.isDesktopApp || !this.mode.isOffline)) ? 'saveas' : 'info';
            if (!panel)
                panel = this.active || defPanel;
            this.$el.show();
            this.scroller.update();
            this.selectMenu(panel, opts, defPanel);
            this.api && this.api.asc_enableKeyEvents(false);

            this.fireEvent('menu:show', [this]);
        },

        hide: function() {
            this.$el.hide();
            // if (this.mode.isEdit) DE.getController('Toolbar').DisableToolbar(false);
            this.fireEvent('menu:hide', [this]);
            // this.api.asc_enableKeyEvents(true);
        },

        applyMode: function() {
            if (!this.rendered) return;

            if (!this.panels) {
                this.panels = {
                    'opts'      : (new DE.Views.FileMenuPanels.Settings({menu:this})).render(this.$el.find('#panel-settings')),
                    'info'      : (new DE.Views.FileMenuPanels.DocumentInfo({menu:this})).render(this.$el.find('#panel-info')),
                    'rights'    : (new DE.Views.FileMenuPanels.DocumentRights({menu:this})).render(this.$el.find('#panel-rights'))
                };
                this._state.infoPreviewMode && this.panels['info'].setPreviewMode(this._state.infoPreviewMode);
            }

            if (!this.mode) return;

            // 1: Back button
            var isVisible = Common.UI.LayoutManager.isElementVisible('toolbar-file-close');
            this.miClose[isVisible?'show':'hide']();

            // 3: Download, save, print, rename
            this.miDownload[((this.mode.canDownload || this.mode.canDownloadOrigin) && (!this.mode.isDesktopApp || !this.mode.isOffline))?'show':'hide']();
            var isBCSupport = Common.Controllers.Desktop.isActive() ? Common.Controllers.Desktop.call("isBlockchainSupport") : false;
            this.miSaveCopyAs[((this.mode.canDownload || this.mode.canDownloadOrigin) && (!this.mode.isDesktopApp || !this.mode.isOffline)) && (this.mode.canRequestSaveAs || this.mode.saveAsUrl) && !isBCSupport ?'show':'hide']();
            this.miSaveAs[((this.mode.canDownload || this.mode.canDownloadOrigin) && this.mode.isDesktopApp && this.mode.isOffline)?'show':'hide']();
            this.miSave[this.mode.showSaveButton && this.mode.canSaveToFile && Common.UI.LayoutManager.isElementVisible('toolbar-file-save') ?'show':'hide']();

            var canEdit = this.mode.canRequestEditRights && (!this.mode.isEdit && this.mode.canEdit || this.mode.isPDFForm && this.mode.canFillForms && this.mode.isRestrictedEdit);
            this.miEdit[canEdit?'show':'hide']();
            this.miPrint[this.mode.canPrint && !this.mode.canPreviewPrint ?'show':'hide']();
            this.miPrintWithPreview[this.mode.canPreviewPrint?'show':'hide']();
            this.miRename[(this.mode.canRename && !this.mode.isDesktopApp) ?'show':'hide']();
            this.miProtect[(this.mode.isSignatureSupport || this.mode.isPasswordSupport) ?'show':'hide']();

            // 2: Recent, create new
            this.miRecent[this.mode.canOpenRecent?'show':'hide']();
            this.miNew[this.mode.canCreateNew?'show':'hide']();

            // 4: Info
            isVisible = Common.UI.LayoutManager.isElementVisible('toolbar-file-info');
            this.miInfo[isVisible?'show':'hide']();
            isVisible = !this.mode.isOffline && this.document&&this.document.info &&
                        (this.document.info.sharingSettings&&this.document.info.sharingSettings.length>0 ||
                        (this.mode.sharingSettingsUrl&&this.mode.sharingSettingsUrl.length || this.mode.canRequestSharingSettings));
            this.miAccess[isVisible?'show':'hide']();
            isVisible = this.mode.canUseHistory&&!this.mode.isDisconnected;
            this.miHistory[isVisible?'show':'hide']();

            // 6: Settings
            isVisible = Common.UI.LayoutManager.isElementVisible('toolbar-file-settings');
            this.miSettings[isVisible?'show':'hide']();
            isVisible = this.mode.canHelp;
            this.miHelp[isVisible ?'show':'hide']();

            // 5: Close button
            isVisible = this.mode.canBack;
            this.miBack[isVisible ?'show':'hide']();

            if (!this.customizationDone) {
                this.customizationDone = true;
                this.mode.canBack && this.mode.customization.goback.text && typeof this.mode.customization.goback.text === 'string' && this.miBack.setCaption(this.mode.customization.goback.text);
            }

            this.panels['opts'].setMode(this.mode);
            this.panels['info'].setMode(this.mode);
            !this.mode.isDisconnected && this.panels['info'].updateInfo(this.document);
            this.panels['rights'].setMode(this.mode);
            !this.mode.isDisconnected && this.panels['rights'].updateInfo(this.document);

            if ( this.mode.canCreateNew ) {
                if (this.mode.templates && this.mode.templates.length) {
                    !this.panels['new'] && (this.panels['new'] = ((new DE.Views.FileMenuPanels.CreateNew({menu: this, docs: this.mode.templates, blank: this.mode.canRequestCreateNew || !!this.mode.createUrl})).render()));
                }
            }

            if ( this.mode.canOpenRecent && this.mode.recent ) {
                !this.panels['recent'] && (this.panels['recent'] = (new Common.Views.RecentFiles({ el: '#panel-recentfiles', menu:this, recent: this.mode.recent})).render());
            }

            if (this.mode.isSignatureSupport || this.mode.isPasswordSupport) {
                !this.panels['protect'] && (this.panels['protect'] = (new DE.Views.FileMenuPanels.ProtectDoc({menu:this})).render());
                this.panels['protect'].setMode(this.mode);
            }

            if (this.mode.canDownload) {
                !this.panels['saveas'] && (this.panels['saveas'] = ((new DE.Views.FileMenuPanels.ViewSaveAs({menu: this, fileType: this.document ? this.document.fileType : undefined, mode: this.mode})).render()));
            } else if (this.mode.canDownloadOrigin)
                $('a',this.miDownload.$el).text(this.textDownload);

            if (this.mode.canDownload && (this.mode.canRequestSaveAs || this.mode.saveAsUrl)) {
                !this.panels['save-copy'] && (this.panels['save-copy'] = ((new DE.Views.FileMenuPanels.ViewSaveCopy({menu: this, fileType: this.document ? this.document.fileType : undefined, mode: this.mode})).render()));
            }

            if (this.mode.canHelp && !this.panels['help']) {
                this.panels['help'] = ((new DE.Views.FileMenuPanels.Help({menu: this})).render());
                this.panels['help'].setLangConfig(this.mode.lang);
            }

            if (this.mode.canPreviewPrint) {
                var printPanel = DE.getController('Print').getView('PrintWithPreview');
                printPanel.menu = this;
                !this.panels['printpreview'] && (this.panels['printpreview'] = printPanel.render(this.$el.find('#panel-print')));
            }

            if ( Common.Controllers.Desktop.isActive()) {
                if (this.$el.find('#fm-btn-local-open').length<1) {
                    $('<li id="fm-btn-local-open" class="fm-btn"/>').insertBefore($('#fm-btn-recent', this.$el));
                    this.items.push(
                        new Common.UI.MenuItem({
                            el      : $('#fm-btn-local-open', this.$el),
                            action  : 'file:open',
                            caption : this.btnFileOpenCaption,
                            canFocused: false,
                            dataHint: 1,
                            dataHintDirection: 'left-top',
                            dataHintOffset: [-2, 22],
                            iconCls: 'menu__icon btn-open'
                        }));
                }

                if (this.$el.find('#fm-btn-exit').length<1) {
                    $('<li class="devider" />' +
                        '<li id="fm-btn-exit" class="fm-btn"/>').insertAfter($('#fm-btn-back', this.$el));
                    this.items.push(
                        new Common.UI.MenuItem({
                            el: $('#fm-btn-exit', this.$el),
                            action: 'file:exit',
                            caption: this.btnExitCaption,
                            canFocused: false,
                            dataHint: 1,
                            dataHintDirection: 'left-top',
                            dataHintOffset: [-2, 22],
                            iconCls: 'menu__icon btn-close'
                        }));
                }
            } else if (this.mode.canCloseEditor && this.$el.find('#fm-btn-close').length<1) {
                $('<li class="devider" />' +
                    '<li id="fm-btn-close" class="fm-btn"/>').insertAfter($('#fm-btn-back', this.$el));
                this.items.push(
                    new Common.UI.MenuItem({
                        el      : $('#fm-btn-close', this.$el),
                        action  : 'close-editor',
                        caption : this.mode.customization.close.text || this.btnCloseEditor,
                        canFocused: false,
                        dataHint: 1,
                        dataHintDirection: 'left-top',
                        dataHintOffset: [-2, 22],
                        iconCls: 'menu__icon btn-close'
                    }));
            }

            if ( this.mode.canSwitchToMobile ) {
                $('<li id="fm-btn-switchmobile" class="fm-btn"></li>').insertBefore($('#fm-btn-settings', this.$el));
                this.items.push(
                    new Common.UI.MenuItem({
                        el      : $('#fm-btn-switchmobile', this.$el),
                        action  : 'switch:mobile',
                        caption : this.btnSwitchToMobileCaption,
                        canFocused: false,
                        dataHint: 1,
                        dataHintDirection: 'left-top',
                        dataHintOffset: [-2, 22],
                        iconCls: 'menu__icon btn-switch-mobile'
                    }));
            }

            this.hideDividers();
        },

        hideDividers: function () {
            const items = Array.from(this.$el.find('.panel-menu > li'));

            const visibleIndices = items
              .map((el, i) => ({ el, i }))
              .filter(({ el }) => $(el).hasClass('fm-btn') && $(el).css('display') !== 'none');

            if (!visibleIndices.length) {
                items.forEach(el => {
                    const $el = $(el);
                    if ($el.hasClass('devider')) {
                        $el.css('display', 'none');
                    }
                });
                return;
            }

            const firstVisible = visibleIndices[0].i;
            const lastVisible = visibleIndices[visibleIndices.length - 1].i;
            let prevWasDivider = false;

            for (let i = items.length - 1; i >= 0; i--) {
                const $el = $(items[i]);

                if ($el.hasClass('devider')) {
                    const shouldShow = i > firstVisible && i < lastVisible;

                    if (shouldShow && !prevWasDivider) {
                        $el.show();
                        prevWasDivider = true;
                    } else {
                        $el.hide();
                    }
                } else if ($el.hasClass('fm-btn') && $el.css('display') !== 'none') {
                    prevWasDivider = false;
                }
            }
        },

        setMode: function(mode, delay) {
            if (mode.isDisconnected) {
                this.mode.canEdit = this.mode.isEdit = false;
                this.mode.canOpenRecent = this.mode.canCreateNew = false;
                this.mode.isDisconnected = mode.isDisconnected;
                this.mode.canRename = false;
                if (!mode.enableDownload)
                    this.mode.canPrint = this.mode.canDownload = this.mode.canDownloadOrigin = false;
            } else {
                this.mode = mode;
            }

            if (!delay) {
                this.applyMode();
            }
            return this;
        },

        setApi: function(api) {
            this.api = api;

            if ( this.rendered ) {
                this.panels['info'].setApi(api);
                if (this.panels['opts']) this.panels['opts'].setApi(api);
                if (this.panels['protect']) this.panels['protect'].setApi(api);
            }

            return this;
        },

        loadDocument: function(data) {
            this.document = data.doc;
        },

        selectMenu: function(menu, opts, defMenu) {
            if ( menu ) {
                var item = this._getMenuItem(menu),
                    panel   = this.panels[menu];
                if ( item.isDisabled() || !item.isVisible()) {
                    item = this._getMenuItem(defMenu);
                    panel   = this.panels[defMenu];
                }
                if ( item && panel ) {
                    $('.fm-btn',this.el).removeClass('active');
                    item.$el.addClass('active');

                    this.$el.find('.content-box:visible').hide();
                    panel.show(opts);

                    if (this.scroller) {
                        var itemTop = Common.Utils.getPosition(item.$el).top,
                            itemHeight = item.$el.outerHeight(),
                            listHeight = this.$el.outerHeight();
                        if (itemTop < 0 || itemTop + itemHeight > listHeight) {
                            var height = this.scroller.$el.scrollTop() + itemTop + (itemHeight - listHeight)/2;
                            height = (Math.floor(height/itemHeight) * itemHeight);
                            this.scroller.scrollTop(height);
                        }
                    }

                    this.active = menu;
                }
            }
        },

        _getMenuItem: function(action) {
            return _.find(this.items, function(item) {
                return item.options.action == action;
            });
        },

        SetDisabled: function(disable, options) {
            var _btn_protect = this.getButton('protect'),
                _btn_history = this.getButton('history');

            options && options.protect && _btn_protect.setDisabled(disable);
            options && options.history && _btn_history.setDisabled(disable);
            options && options.info && (this.panels ? this.panels['info'].setPreviewMode(disable) : this._state.infoPreviewMode = disable );
        },

        isVisible: function () {
            return !this.$el.is(':hidden');
        },

        getButton: function(type) {
            if ( !this.rendered ) {
                if (type == 'save') {
                    return this.options.miSave ? this.options.miSave : (this.options.miSave = new Common.UI.MenuItem({}));
                } else
                if (type == 'rename') {
                    return this.options.miRename ? this.options.miRename : (this.options.miRename = new Common.UI.MenuItem({}));
                } else
                if (type == 'protect') {
                    return this.options.miProtect ? this.options.miProtect : (this.options.miProtect = new Common.UI.MenuItem({}));
                } else
                if (type == 'history') {
                    return this.options.miHistory ? this.options.miHistory : (this.options.miHistory = new Common.UI.MenuItem({}));
                }
            } else {
                if (type == 'save') {
                    return this.miSave;
                } else
                if (type == 'rename') {
                    return this.miRename;
                }else
                if (type == 'protect') {
                    return this.miProtect;
                }else
                if (type == 'history') {
                    return this.miHistory;
                }
            }
        },

        btnSaveCaption          : 'Save',
        btnDownloadCaption      : 'Download as...',
        btnInfoCaption          : 'Document Info...',
        btnRightsCaption        : 'Access Rights...',
        btnCreateNewCaption     : 'Create New',
        btnRecentFilesCaption   : 'Open Recent...',
        btnPrintCaption         : 'Print',
        btnHelpCaption          : 'Help...',
        btnReturnCaption        : 'Back to Document',
        btnToEditCaption        : 'Edit Document',
        btnBackCaption          : 'Go to Documents',
        btnSettingsCaption      : 'Advanced Settings...',
        btnHistoryCaption       : 'Versions History',
        btnSaveAsCaption        : 'Save as',
        textDownload            : 'Download',
        btnRenameCaption        : 'Rename...',
        btnCloseMenuCaption     : 'Back',
        btnProtectCaption: 'Protect',
        btnSaveCopyAsCaption    : 'Save Copy as...',
        btnExitCaption          : 'Exit',
        btnFileOpenCaption      : 'Open...',
        btnCloseEditor          : 'Close File',
        ariaFileMenu            : 'File menu'
    }, DE.Views.FileMenu || {}));
});
