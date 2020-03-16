$(document).ready(function() {

  var measureData = [
    {
      categoryName: "Weight",
      units: [
            {unit: "gram", unitMagnitude: 1},
            {unit: "kilogram", unitMagnitude: 1000},
            {unit: "ton", unitMagnitude: 1000000},
            {unit: "dram", unitMagnitude: 1.77184},
            {unit: "ounce", unitMagnitude: 28.3495},
            {unit: "pound", unitMagnitude: 453.592},
            {unit: "stone", unitMagnitude: 6350.29},
      ]
    },
    {
      categoryName: "Lenght",
      units: [
        {unit: "meter", unitMagnitude: 1000},
        {unit: "kilometer", unitMagnitude: 1000000},
        {unit: "centimeter", unitMagnitude: 100},
        {unit: "millimeter", unitMagnitude: 1},
        {unit: "micrometer", unitMagnitude: 0.001},
        {unit: "nanometer", unitMagnitude: 0.000001},
        {unit: "mile", unitMagnitude: 1609344},
        {unit: "yard", unitMagnitude: 914.4},
        {unit: "foot", unitMagnitude: 304.8},
        {unit: "inch", unitMagnitude: 25.4},
      ]
    },
    {
      categoryName: "Temperature",
      units: [
        {unit: "celsius"},
        {unit: "kelvin"},
        {unit: "farenheit"},
      ]
    },
    {
      categoryName: "Volume",
      units: [
        {unit: "liter", unitMagnitude: 1},
        {unit: "millilter", unitMagnitude: 0.001},
        {unit: "galone", unitMagnitude: 3.78541},
        {unit: "pinte", unitMagnitude: 0.58261},
        {unit: "kubimeter", unitMagnitude: 1000},
        {unit: "barel", unitMagnitude: 158.987},
      ]
    },
    {
      categoryName: "Area",
      units: [
        {unit: "quadratmeter", unitMagnitude: 1},
        {unit: "quadratkilometer", unitMagnitude: 1000000},
        {unit: "quadratmile", unitMagnitude: 2590000},
        {unit: "quadratyard", unitMagnitude: 0.836127},
        {unit: "quadratfoot", unitMagnitude: 0.092903},
        {unit: "quadratinch", unitMagnitude:0.00064516},
        {unit: "hektar", unitMagnitude: 10000},
        {unit: "acre", unitMagnitude: 4046.86},
      ]
    },
    {
      categoryName: "Time",
      units: [
        {unit: "secunde", unitMagnitude: 1},
        {unit: "millisecunde", unitMagnitude: 0.001},
        {unit: "minute", unitMagnitude: 60},
        {unit: "hour", unitMagnitude: 3600},
        {unit: "day", unitMagnitude: 86400},
        {unit: "woche", unitMagnitude: 604800},
        {unit: "year", unitMagnitude: 31540000},
      ]
    },
  ];
  var data = {
    currentCategory: "Weight",
    currentUnit: "gram",
    endUnit: "kilogram",
    currentUnitmagnitude: 1,
    endUnitmagnitude: 1000
  };

  setMeasure ();
  setUnit();
  doUnitsclickable();

  function setMeasure () {
    $('.current-measure').html(data.currentCategory);
    setMenus();
    setUnit();
  }
  function setUnit () {
    $('.current-unit').html(data.currentUnit);
    $('.end-unit').html(data.endUnit);
  }

  function setMenus () {
    $("#current-menu .unit, #end-menu .unit").remove();
    $('.conversion ul').each(function() {
      fillMenus(this);
      doUnitsclickable();
    });
  }

  function fillMenus(menu) {
    var cat = data.currentCategory;
    var arr = measureData.find(item => item.categoryName == cat);
    var myItems = [];

    $.each(arr.units, function(key, value){
      myItems.push("<li class='unit'>" + value.unit + "</li>");
    });
    $(menu).append(myItems.join(""))
  };

  function doUnitsclickable () {
    $(".unit").click(chooseUnit);
  }
  $(".measure li").click(chooseMeasure);

  function chooseUnit() {
    var parent = $( this ).parent().attr('id');

    if (parent == 'current-menu') {
      data.currentUnit = $(this).text();
    } else {
      data.endUnit = $(this).text();
    }
    setUnit();
    setUnitsmagnitude();
  };

  function chooseMeasure() {
    data.currentCategory = $(this).text();
    var arr = measureData.find(item => item.categoryName == data.currentCategory);
    data.currentUnit = arr.units[0].unit;
    data.endUnit = arr.units[1].unit;
    setMeasure()
  };

  $(".current-unit, .end-unit, .current-measure").on('click', openCurrentMenu);

  function openCurrentMenu() {
    var menu = $(this).next("ul");
    $(menu).toggleClass("menu-opened");
    console.log(this);
    $(document).on('click.my-dropdown', closeAllMenus);
  };

  function closeAllMenus(event) {
    $elem = $(event.currentTarget);

    if (!$(event.target).closest('.end-unit, ul').length && !$(event.target).closest('.current-unit, ul').length && !$(event.target).closest('.current-measure, ul').length) {
      $('ul').removeClass("menu-opened");
      $(document).off('click.my-dropdown');
    }
  }

  $("#current-form, #end-form").keypress(function (e) {
    var input, output, relation, direction;
    if ($( this ).attr('id') == "current-form") {
      input = $(".current-measure-list input");
      output = $(".end-measure-list input");
      relation = data.currentUnitmagnitude/data.endUnitmagnitude;
      direction = "right";
    } else {
      input = $(".end-measure-list input");
      output = $(".current-measure-list input");
      relation = data.endUnitmagnitude/data.currentUnitmagnitude;
    }

    if (e.which == 13) {
      if (data.currentCategory == "Temperature") {
        converseTemperature(input, output, direction)
      } else {
        converse(input, output, relation);
      }
      return false;
    }
  });

  function converse(input, output, relation) {
    setUnitsmagnitude();
    var result = input.val() * relation;
    output.val(result);
  };

  function setUnitsmagnitude() {
    var curUni = data.currentUnit;
    var endUni = data.endUnit;
    var cat = data.currentCategory;
    var arr = measureData.find(item => item.categoryName == cat);
    data.currentUnitmagnitude = arr.units.find(item => item.unit == curUni).unitMagnitude;
    data.endUnitmagnitude = arr.units.find(item => item.unit == endUni).unitMagnitude;
  };

  function converseTemperature(input, output, direction) {
    var curUni, endUni;
    if(direction == "right") {
      curUni = data.currentUnit;
      endUni = data.endUnit;
    } else {
      curUni = data.endUnit;
      endUni = data.currentUnit;
    }

    var inputVal = parseFloat(input.val());
    var result;
    switch (curUni) {
      case "celsius":
        if (endUni =="kelvin") {
          result = (inputVal + 273.15);
        } else if (endUni =="farenheit") {
          result = inputVal * 9/5 + 32;
        } else {
          result = inputVal;
        }
        break;
      case "kelvin":
        if (endUni =="celsius") {
          result = inputVal - 273.15;
        } else if (endUni =="farenheit") {
          result = (inputVal - 273.15) * 5/9 + 32;
        } else {
          result = inputVal;
        }
        break;
      case "farenheit":
        if (endUni =="kelvin") {
          result = (inputVal - 32) * 5/9 + 273.15;
        } else if (endUni =="celsius") {
          result = (inputVal - 32) * 5/9;
        } else {
          result = inputVal;
        }
    }
    output.val(result);
  console.log(curUni, endUni, inputVal, result)
  }
});
