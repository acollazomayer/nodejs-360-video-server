
'use strict';

var AnimatedImplementation = require('AnimatedImplementation');
var Image = require('Image');
var Text = require('Text');
var View = require('View');
var ScrollView = require('ScrollView');

module.exports = babelHelpers.extends({}, AnimatedImplementation, {
  View: AnimatedImplementation.createAnimatedComponent(View),
  Text: AnimatedImplementation.createAnimatedComponent(Text),
  Image: AnimatedImplementation.createAnimatedComponent(Image),
  ScrollView: AnimatedImplementation.createAnimatedComponent(ScrollView)
});