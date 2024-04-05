
window.sjsAdaptor = {
    init: function (host, config) {
        if (config.hostStyle) {
            var hostStyle = config.hostStyle;
            var styles = hostStyle.split(';');
            styles.forEach((styleStr) => {
                var style = styleStr.split(':');
                host.style[style[0]] = style[1];
            });
            delete config.hostStyle;
        }

        var spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), { sheetCount: 1 });
        // Get the activesheet
        var activeSheet = spread.getActiveSheet();
        // set allowCopyPasteExcelStyle to true
        spread.options.allowCopyPasteExcelStyle = true;
        
        // bind Clipboard events
        activeSheet.bind(GC.Spread.Sheets.Events.ClipboardChanged, function (sender, args) {
            console.log("ClipboardChanged.");
        });

        activeSheet.bind(GC.Spread.Sheets.Events.ClipboardChanging, function (sender, args) {
            console.log("ClipboardChanging");
        });

        activeSheet.bind(GC.Spread.Sheets.Events.ClipboardPasted, function (sender, args) {
            console.log("ClipboardPasted");
        });

        activeSheet.bind(GC.Spread.Sheets.Events.ClipboardPasting, function (sender, args) {
            console.log("ClipboardPasting");
        });
        
        activeSheet.bind(GC.Spread.Sheets.Events.ClipboardPasting, (e, args) => {
            console.log(args.action);

            // This code prevent the internal floating element copy paste
            if (args.objects && args.objects.length > 0 && args.fromSheet.name() == "Sheet1") {
                args.cancel = true;
            }
            // This code prevents accidental cut operations
            else if (args.action == GC.Spread.Sheets.ClipboardActionType.cut) {
                if (confirm("You are performing a Cut operation.\nGo ahead?") == true) {
                    text = "You pressed OK!";
                } else {
                    text = "You canceled!";
                    args.cancel = true;
                }
            }
        });

        return new GC.Spread.Sheets.Workbook(host, config);
    },

    setValue: function (host, sheetIndex, row, col, value) {
        var spread = GC.Spread.Sheets.findControl(host);
        if (spread) {
            var sheet = spread.getSheet(sheetIndex);
            sheet.setValue(row, col, value);
        }
    },

    openExcel: function (host, inputFile) {
        var spread = GC.Spread.Sheets.findControl(host);
        if (spread) {
            var excelIO = new GC.Spread.Excel.IO();
            excelIO.open(inputFile.files[0], function (json) {
                spread.fromJSON(json);
            })
        }
    }
};