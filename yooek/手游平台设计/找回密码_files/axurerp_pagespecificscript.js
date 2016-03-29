for(var i = 0; i < 12; i++) { var scriptId = 'u' + i; window[scriptId] = document.getElementById(scriptId); }

$axure.eventManager.pageLoad(
function (e) {

});
u4.tabIndex = 0;

u4.style.cursor = 'pointer';
$axure.eventManager.click('u4', function(e) {

if (true) {

	self.location.href=$axure.globalVariableProvider.getLinkUrl('注册页面.html');

}
});
gv_vAlignTable['u4'] = 'top';gv_vAlignTable['u5'] = 'top';gv_vAlignTable['u7'] = 'top';
u8.style.cursor = 'pointer';
$axure.eventManager.click('u8', function(e) {

if (true) {

	self.location.href=$axure.globalVariableProvider.getLinkUrl('找回密码下一步.html');

}
});
gv_vAlignTable['u10'] = 'center';
u11.style.cursor = 'pointer';
$axure.eventManager.click('u11', function(e) {

if (true) {

	self.location.href=$axure.globalVariableProvider.getLinkUrl('.html');

}
});
gv_vAlignTable['u1'] = 'center';gv_vAlignTable['u3'] = 'center';