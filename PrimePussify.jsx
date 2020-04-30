try {
  activeDocument.activeLayer && activeDocument.activeLayer.textItem && init();
} catch (err) {
  alert(err);
}

function init() {
  var customOptionsConfig = {
    settingsName: "PrimePuss",
    valueName: "VarianceSizes"
  };
  var historyBeforePussification = app.activeDocument.activeHistoryState;

  // UI
  var uiWindow = new Window("dialog", "Prime Pussify controls");
  // Make a big window to allow for a comfortable space for fine tuning with slider knobs
  uiWindow.preferredSize = { width: 800, height: 300 };
  uiWindow.alignChildren = "fill";

  /*
    We have two set of values based on how they obtain their initial values:
    1. OrigSize and OrigTracking which are set to whatever their values happen to be at time of the invocation
    2. SizeVariance, TrackVariance and BaselineVariance which are set based on the previous session stored values
  */
  var OrigSize = activeDocument.activeLayer.textItem.size.value;
  var OrigTracking = activeDocument.activeLayer.textItem.tracking;
  var SizeVariance = 0;
  var TrackVariance = 0;
  var BaselineVariance = 0;
  try {
    var vv = app
      .getCustomOptions(customOptionsConfig.settingsName)
      .getString(app.stringIDToTypeID(customOptionsConfig.valueName))
      .split(",");
    SizeVariance = vv[0];
    TrackVariance = vv[1];
    BaselineVariance = vv[2];
  } catch (err) {}

  // Font Size
  uiWindow.add('statictext {text: "Font Size:", justify: "center"}');
  var sizeSlider = createSlider("Size: ", 6, 72, OrigSize);
  var sizeVarianceSlider = createSlider("Size vary:", 0, 72, SizeVariance);

  // Character Tracking
  uiWindow.add('statictext {text: "Character Tracking:",justify: "center"}');
  var trackSlider = createSlider("Track: ", -100, 200, OrigTracking);
  var trackVarianceSlider = createSlider("Track vary: ", 0, 200, TrackVariance);

  // Baseline
  uiWindow.add('statictext {text: "Baseline:",justify: "center"}');
  var baselineVarianceSlider = createSlider("Baseline vary:", 0, 20, BaselineVariance, 2);

  // UI Buttons
  var buttons = uiWindow.add("group");
  buttons.alignment = "center";
  buttons.margins = [0, 30, 0, 0];
  buttons.add("button", undefined, "OK");
  buttons.add("button", undefined, "Cancel");

  if (uiWindow.show() === 1) // Ok
  {
    storeValues();
  } else // Cancel
  {
    app.activeDocument.activeHistoryState = historyBeforePussification;
  }

  function createSlider(label, minValue, maxValue, startValue, precision) {
    startValue = formatNumber(startValue, precision);
    var g = uiWindow.add("group");

    // Label
    g.add("statictext", [0, 0, 90, 20], label);

    // Slider track
    var slider = g.add(
      "slider",
      [0, 0, 600, 10],
      startValue,
      minValue,
      maxValue
    );
    slider.addEventListener("changing", function () {
      textValue.text = formatNumber(this.value, precision);
    });
    slider.addEventListener("change", pussify);
    function updateSlider() {
      slider.value = Number(this.text);
      pussify();
    }

    // Slider input field value
    var textValue = g.add("edittext", undefined, startValue);
    textValue.justify = "right";
    textValue.characters = 6; // width of the input field
    textValue.addEventListener("changing", updateSlider);
    // Enable keyboard arrows control
    textValue.addEventListener("keyup", function (key) {
      var step = 1;
      if (key.shiftKey) step = 10;
      if (key.altKey) step = 0.1;
      switch (key.keyName) {
        case "Up":
          this.text = String(Number(this.text) + step);
          updateSlider.apply(this);
          break;
        case "Down":
          this.text = String(Number(this.text) - step);
          updateSlider.apply(this);
      }
    });

    return slider;
  }

  function formatNumber(n, precision) {
    return Math.round(Number(n).toFixed(precision || 0) * 100) / 100;
  }

  function pussify() {
    prime_puss(
      sizeSlider.value,
      sizeVarianceSlider.value,
      trackSlider.value,
      trackVarianceSlider.value,
      baselineVarianceSlider.value
    );
  }

  function storeValues() {
    var d0 = new ActionDescriptor();
    d0.putString(
      stringIDToTypeID(customOptionsConfig.valueName),
      [
        sizeVarianceSlider.value,
        trackVarianceSlider.value,
        baselineVarianceSlider.value
      ].join(",")
    );
    app.putCustomOptions(customOptionsConfig.settingsName, d0, true);
  }
}

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
    refresh();
}
