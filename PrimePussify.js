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

function MakeSlider ( parent, name, defaultValue, minValue, maxValue )
{
    var group = parent.add ( "group" );
    group.alignment = "left";

    var label = group.add ( "statictext", [0,0,110,30], name);
    var slider = group.add ("slider", [0,0,200,10], defaultValue);
    slider.minvalue = minValue;
    slider.maxvalue = maxValue;
    slider.value = defaultValue;

    var value = group.add ( "statictext", [0,0,35,30], defaultValue, { alignment: "right" });
    value.justify = "right";
    slider.onChanging = function() { value.text = slider.value.toFixed(1).split(".0")[0]; }; // Javascript is an abomination

    return slider;
}

var PrevPuss = "11, 0, 25, 0, 0";
var SettingsName = "PrimePuss";
var ValueName = "SizeBase";

try
{
    var fontSize = 48;
    try
    {
        var tLayer = activeDocument.activeLayer;
        fontSize = tLayer.textItem.size.value;
    }catch(e)
    {
        alert(e);
    }

    var uiWindow = new Window ("dialog", "Prime Pussify");
    var size = MakeSlider(uiWindow, "Size", fontSize, 1, 512 );
    var sizeVariance = MakeSlider(uiWindow, "Size Variance", 0, -12, 12 );
    var spacing = MakeSlider(uiWindow, "Spacing", 4, -16, 16 );
    var spacingVariance = MakeSlider(uiWindow, "Spacing Variance", 1, -32, 32 );
    var baselineVariance = MakeSlider(uiWindow, "Baseline Variance", 3, 10, 64 );

    var buttons = uiWindow.add("group");
    var okBtn = buttons.add( "button", undefined, "Ok");
    var cancelBtn = buttons.add( "button", undefined, "Cancel");
    
    if ( uiWindow.show () == 1 )
    {
        var values = [size.value, sizeVariance.value, spacing.value, spacingVariance.value, baselineVariance.value];
        PrevPuss = values.join ( ", ")
        prime_puss.apply ( null, values );
    }

}
catch(err)
{
    alert(err);
}

