function prime_puss(OrigSize, SizeVariance, OrigTracking, TrackVariance, BaselineVariance)
{
    var doc = app.activeDocument;
    var t = doc.activeLayer.textItem;
    var color = t.color;
    var font = t.font;
//    var OrigSize = parseFloat(t.size);
//    var OrigBaseline = parseFloat(t.baselineShift);
//    var OrigTracking = parseFloat(t.tracking);

    var OrigBaseline = 0.0;

    var d = new ActionDescriptor();
    var r = new ActionReference();
    r.putEnumerated(stringIDToTypeID("textLayer"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));
    d.putReference(stringIDToTypeID("null"), r);
    var d1 = new ActionDescriptor();
    var list1 = new ActionList();

    for(var i=0; i < t.contents.length; i++)
    {
        var from = i;
        var len = 1;
        var size = OrigSize + (Math.random() * SizeVariance) - (SizeVariance/2);
        var baseline = OrigBaseline + (Math.random() * BaselineVariance) - (BaselineVariance/2);
        var tracking = OrigTracking + (Math.random() * TrackVariance) - (TrackVariance/2);

        tracking *= 0.001;

        var d2 = new ActionDescriptor();
        d2.putInteger(stringIDToTypeID("from"), from);
        d2.putInteger(stringIDToTypeID("to"), from+len);
        var d3 = new ActionDescriptor();
        d3.putUnitDouble(stringIDToTypeID("size"), stringIDToTypeID("pointsUnit"), size);
        d3.putUnitDouble(stringIDToTypeID("baselineShift"), stringIDToTypeID("pointsUnit"), baseline);
        d3.putDouble(stringIDToTypeID("tracking"), tracking);
        d3.putString(stringIDToTypeID("fontPostScriptName"), font);
        var d4 = new ActionDescriptor();
        d4.putDouble(stringIDToTypeID("red"), color.rgb.red);
        d4.putDouble(stringIDToTypeID("green"), color.rgb.green);
        d4.putDouble(stringIDToTypeID("blue"), color.rgb.blue);
        d3.putObject(stringIDToTypeID("color"), stringIDToTypeID("RGBColor"), d4);
        d2.putObject(stringIDToTypeID("textStyle"), stringIDToTypeID("textStyle"), d3);
        list1.putObject(stringIDToTypeID("textStyleRange"), d2);
    }

    d1.putList(stringIDToTypeID("textStyleRange"), list1);
    d.putObject(stringIDToTypeID("to"), stringIDToTypeID("textLayer"), d1);
    executeAction(stringIDToTypeID("set"), d, DialogModes.NO);
}

var PrevPuss = "11, 0, 25, 0, 0";
var SettingsName = "PrimePuss";
var ValueName = "SizeBase";
try
{
    PrevPuss = app.getCustomOptions(SettingsName).getString(app.stringIDToTypeID(ValueName));
}
catch(err)
{
}

var S = prompt("Enter the variance in points as [size, size vary, spacing, spacing vary, baseline vary]:", PrevPuss);
if(S)
{
    var d0 = new ActionDescriptor();
    d0.putString(stringIDToTypeID(ValueName), S);
    app.putCustomOptions(SettingsName, d0, true);

     var p = S.split(',');
    prime_puss(parseFloat(p[0]), parseFloat(p[1]), parseFloat(p[2]), parseFloat(p[3]), parseFloat(p[4]));
}
