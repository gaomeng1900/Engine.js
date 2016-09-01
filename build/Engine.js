/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	// Copied from https://github.com/facebook/react/blob/bef45b0/src/shared/utils/canDefineProperty.js
/******/ 	var canDefineProperty = false;
/******/ 	try {
/******/ 		Object.defineProperty({}, "x", {
/******/ 			get: function() {}
/******/ 		});
/******/ 		canDefineProperty = true;
/******/ 	} catch(x) {
/******/ 		// IE will fail on defineProperty
/******/ 	}
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "48b4470f22680bc02cad"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(canDefineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(canDefineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 2;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/demo";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(24);
	module.exports = __webpack_require__(21);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * 数学计算
	 */
	
	/**
	 * 获取两点距离
	 * @method getDistance
	 * @param  {{x,y}}    A点
	 * @param  {{x,y}}    B点
	 * @return {Float}    距离
	 */
	function getDistance(A, B) {
	    return Math.sqrt(Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2));
	}
	
	/**
	 * 二维向量
	 */
	
	var Vec2 = function () {
	    function Vec2(x, y) {
	        _classCallCheck(this, Vec2);
	
	        this.x = x;
	        this.y = y;
	        this.info = {}; // 直接把生成信息带到向量里, 就是这么diao
	    }
	    // 取模
	
	
	    _createClass(Vec2, [{
	        key: 'getMod',
	        value: function getMod() {
	            return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	        }
	        // 获取反向
	
	    }, {
	        key: 'getOpp',
	        value: function getOpp() {
	            return new Vec2(-this.x, -this.y);
	        }
	        // 获取垂线 (顺时针)
	
	    }, {
	        key: 'getPerp',
	        value: function getPerp() {
	            return new Vec2(this.y, -this.x);
	        }
	        // 乘积
	
	    }, {
	        key: 'product',
	        value: function product(n) {
	            return new Vec2(this.x * n, this.y * n);
	        }
	    }, {
	        key: 'mult',
	        value: function mult(n) {
	            return new Vec2(this.x * n, this.y * n);
	        }
	        // 点积
	
	    }, {
	        key: 'dot',
	        value: function dot(b) {
	            return this.x * b.x + this.y * b.y;
	        }
	        // 垂直点乘
	
	    }, {
	        key: 'perpDot',
	        value: function perpDot(b) {
	            var res = this.getOpp().dot(b);
	            // 取正
	            if (res < 0) {
	                res = -res;
	            }
	            return res;
	        }
	        //  向量加
	
	    }, {
	        key: 'add',
	        value: function add(b) {
	            return new Vec2(this.x + b.x, this.y + b.y);
	        }
	        // 向量减
	
	    }, {
	        key: 'sub',
	        value: function sub(b) {
	            return new Vec2(this.x - b.x, this.y - b.y);
	        }
	        // 判断相等
	
	    }, {
	        key: 'equal',
	        value: function equal(b) {
	            return this.x === b.x && this.y && b.y;
	        }
	        // 修改
	
	    }, {
	        key: 'set',
	        value: function set(x, y) {
	            this.x = x;
	            this.y = y;
	        }
	        // 化为单位向量
	
	    }, {
	        key: 'unit',
	        value: function unit() {
	            var mod = this.getMod();
	            // console.log('mod', mod);
	            if (mod === 0) {
	                throw new Error('无法化为单位向量: ', JSON.stringify(this));
	            }
	            return this.mult(1 / mod);
	        }
	        // 判断是否零向量
	
	    }, {
	        key: 'isZero',
	        value: function isZero() {
	            return this.x === 0 && this.y === 0;
	        }
	        // 顺时针旋转
	
	    }, {
	        key: 'rotate',
	        value: function rotate(deg, o) {
	            var len = this.sub(o).getMod();
	            // console.log(len, this.x, this.y);
	            var α = Math.atan2(this.y - o.y, this.x - o.x);
	            var β = α + deg;
	            // console.log(α, len * Math.cos(β), len * Math.sin(β));
	            this.x = o.x + len * Math.cos(β);
	            this.y = o.y + len * Math.sin(β);
	        }
	    }]);
	
	    return Vec2;
	}();
	
	// 向量三重积
	
	
	function vecTripleProduct(a, b, c) {
	    // a * b * c = -a(c . b) + b(c . a)
	    // console.log('三重积', a, b, c, b.product(c.dot(a)).sub(a.product(c.dot(b))));
	    // console.log('#001', c.dot(a), b.product(c.dot(a)), c.dot(b), a.product(c.dot(b)));
	    return b.mult(c.dot(a)).sub(a.mult(c.dot(b)));
	}
	
	// 根据方向获取闵可夫斯基差的支撑点
	function support(shapeA, shapeB, dir) {
	    var pA = shapeA.getFarthest(dir);
	    var pB = shapeB.getFarthest(dir.getOpp());
	    // console.log('support: ', dir, pA, pB, pA.sub(pB));
	    var support = pA.sub(pB);
	    support.info.pair = {
	        A: pA,
	        B: pB
	    };
	    return support;
	}
	
	// 点线距
	function getDisPointLine(p, a, b) {
	    // 线向量
	    var ab = b.sub(a);
	    // 点到端点的向量
	    var pa = a.sub(p);
	    // 点到线的垂线
	    var n = vecTripleProduct(ab, pa, ab);
	    if (n.isZero()) {
	        return 0;
	    };
	    n = n.unit();
	    // 距离
	    var d = n.dot(a);
	    return d;
	}
	
	exports.getDistance = getDistance;
	exports.Vec2 = Vec2;
	exports.vecTripleProduct = vecTripleProduct;
	exports.support = support;
	exports.getDisPointLine = getDisPointLine;
	
	// export default {
	//     getDistance,
	//     Vec2,
	//     vecTripleProduct,
	// }

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Base = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 基类(虚基类)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Simon
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @create 2016-08-09
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */
	
	var _tool = __webpack_require__(4);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Base = exports.Base = function () {
	    function Base(x, y) {
	        _classCallCheck(this, Base);
	
	        this.x = x;
	        this.y = y;
	        this.vx = 0;
	        this.vy = 0;
	        this.ax = 0;
	        this.ay = 0;
	        this.f = 0; // 摩擦力
	        this.spring = 0.5; // 弹性
	        // this.free   = true; // 按照自己的v/a自由运动
	        this.scale = 1; // 缩放比例
	        this.rotate = 0; // 旋转角度
	        this.fillStyle = 'rgba(0, 0, 0, 0)'; // 填充颜色
	        this.strokeStyle = 'rgba(0, 0, 0, 1)'; // 描边颜色
	        // this.playYard  = PLAY_ZONE ; // 活动区域
	        this.m = 1; // 质量
	        this.angularVelocity = 0;
	        this.dead = false; // 为true证明可以清理了
	        this.__GUID = (0, _tool.getID)();
	    }
	
	    _createClass(Base, [{
	        key: 'move',
	        value: function move() {
	            var freq = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
	
	            // 加速度
	            this.vx += this.ax / freq;
	            this.vy += this.ay / freq;
	            // 摩擦力
	            this.vx *= 1 - this.f / freq;
	            this.vy *= 1 - this.f / freq;
	            // 移动
	            this.x += this.vx / freq;
	            this.y += this.vy / freq;
	        }
	    }, {
	        key: 'draw',
	        value: function draw() {/**/}
	    }, {
	        key: 'getBounds',
	        value: function getBounds() {/**/}
	    }, {
	        key: 'destory',
	        value: function destory() {
	            this.dead = true;
	        }
	    }, {
	        key: 'action',
	        value: function action() {/**/}
	    }]);

	    return Base;
	}();

/***/ },
/* 3 */
/***/ function(module, exports) {

	var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['CloseCurlyDoubleQuote', [8221]], ['CloseCurlyQuote', [8217]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];
	
	var alphaIndex = {};
	var charIndex = {};
	
	createIndexes(alphaIndex, charIndex);
	
	/**
	 * @constructor
	 */
	function Html5Entities() {}
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html5Entities.prototype.decode = function(str) {
	    if (str.length === 0) {
	        return '';
	    }
	    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
	        var chr;
	        if (entity.charAt(0) === "#") {
	            var code = entity.charAt(1) === 'x' ?
	                parseInt(entity.substr(2).toLowerCase(), 16) :
	                parseInt(entity.substr(1));
	
	            if (!(isNaN(code) || code < -32768 || code > 65535)) {
	                chr = String.fromCharCode(code);
	            }
	        } else {
	            chr = alphaIndex[entity];
	        }
	        return chr || s;
	    });
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 Html5Entities.decode = function(str) {
	    return new Html5Entities().decode(str);
	 };
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html5Entities.prototype.encode = function(str) {
	    var strLength = str.length;
	    if (strLength === 0) {
	        return '';
	    }
	    var result = '';
	    var i = 0;
	    while (i < strLength) {
	        var charInfo = charIndex[str.charCodeAt(i)];
	        if (charInfo) {
	            var alpha = charInfo[str.charCodeAt(i + 1)];
	            if (alpha) {
	                i++;
	            } else {
	                alpha = charInfo[''];
	            }
	            if (alpha) {
	                result += "&" + alpha + ";";
	                i++;
	                continue;
	            }
	        }
	        result += str.charAt(i);
	        i++;
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 Html5Entities.encode = function(str) {
	    return new Html5Entities().encode(str);
	 };
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html5Entities.prototype.encodeNonUTF = function(str) {
	    var strLength = str.length;
	    if (strLength === 0) {
	        return '';
	    }
	    var result = '';
	    var i = 0;
	    while (i < strLength) {
	        var c = str.charCodeAt(i);
	        var charInfo = charIndex[c];
	        if (charInfo) {
	            var alpha = charInfo[str.charCodeAt(i + 1)];
	            if (alpha) {
	                i++;
	            } else {
	                alpha = charInfo[''];
	            }
	            if (alpha) {
	                result += "&" + alpha + ";";
	                i++;
	                continue;
	            }
	        }
	        if (c < 32 || c > 126) {
	            result += '&#' + c + ';';
	        } else {
	            result += str.charAt(i);
	        }
	        i++;
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 Html5Entities.encodeNonUTF = function(str) {
	    return new Html5Entities().encodeNonUTF(str);
	 };
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html5Entities.prototype.encodeNonASCII = function(str) {
	    var strLength = str.length;
	    if (strLength === 0) {
	        return '';
	    }
	    var result = '';
	    var i = 0;
	    while (i < strLength) {
	        var c = str.charCodeAt(i);
	        if (c <= 255) {
	            result += str[i++];
	            continue;
	        }
	        result += '&#' + c + ';';
	        i++
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 Html5Entities.encodeNonASCII = function(str) {
	    return new Html5Entities().encodeNonASCII(str);
	 };
	
	/**
	 * @param {Object} alphaIndex Passed by reference.
	 * @param {Object} charIndex Passed by reference.
	 */
	function createIndexes(alphaIndex, charIndex) {
	    var i = ENTITIES.length;
	    var _results = [];
	    while (i--) {
	        var e = ENTITIES[i];
	        var alpha = e[0];
	        var chars = e[1];
	        var chr = chars[0];
	        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
	        var charInfo;
	        if (addChar) {
	            charInfo = charIndex[chr] = charIndex[chr] || {};
	        }
	        if (chars[1]) {
	            var chr2 = chars[1];
	            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
	            _results.push(addChar && (charInfo[chr2] = alpha));
	        } else {
	            alphaIndex[alpha] = String.fromCharCode(chr);
	            _results.push(addChar && (charInfo[''] = alpha));
	        }
	    }
	}
	
	module.exports = Html5Entities;


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	
	/**
	 * 生成简化的GUID
	 * @method __getID
	 * @return {String}
	 */
	function getID() {
	    var d = new Date().getTime();
	    return 'xxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	        var r = (d + Math.random() * 16) % 16 | 0;
	        d = Math.floor(d / 16);
	        return (c == 'x' ? r : r & 0x7 | 0x8).toString(16);
	    });
	};
	
	/**
	 * 自动调频
	 * @method optFreq
	 * @param  {Float} newFreq 新周期
	 */
	function autoFreq(frameCycle) {
	    // 高精度模式
	    if (this.autoFreqMode === 'turbo') {
	        var endTime = new Date().getTime();
	
	        if (this._autoFreqTimmer > 30) {
	            var oldSam = this.samsaraCount;
	            this._autoFreqTimmer = 0;
	            // if (this._bufferFunCycle.reduce((pre, cur) => pre + cur) / 30 < 8.5) {
	            //     this.samsaraCount += 10;
	            // }
	
	            var av = this._bufferFrameCycle.reduce(function (pre, cur) {
	                return pre + cur;
	            }) / 30;
	            if (av < 18) {
	                this.samsaraCount += 5;
	            }
	            if (av > 18) {
	                this.samsaraCount = 1 + this.samsaraCount * 0.8;
	            }
	            // this.entities.map(entity => {
	            //     entity.vx *= oldSam / this.samsaraCount;
	            // })
	
	            // console.log('每帧', oldSam, '个轮回');
	            // console.log('用时', endTime - this._frameTimestamp, '毫秒');
	            // console.log('帧周期', frameCycle, '毫秒');
	            // console.log('调频: ', this.samsaraCount);
	            // console.log('---------------------------');
	        }
	
	        this._bufferFunCycle[this._autoFreqTimmer] = endTime - this._frameTimestamp;
	        this._bufferFrameCycle[this._autoFreqTimmer] = frameCycle;
	        this._autoFreqTimmer += 1;
	    }
	
	    // 平衡模式
	    if (this.autoFreqMode === 'balance') {
	        var vMax = this.entities.reduce(function (pre, cur) {
	            var approximateV = Math.sqrt(Math.pow(cur.vx, 2) + Math.pow(cur.vy, 2));
	            if (approximateV > pre) {
	                return approximateV;
	            } else {
	                return pre;
	            }
	        }, 0.5);
	        this.samsaraCount = Math.floor(vMax * 2);
	        // console.log(this.samsaraCount);
	    }
	}
	
	exports.getID = getID;
	exports.autoFreq = autoFreq;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _math = __webpack_require__(1);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Contact = function () {
	    function Contact(shapeA, shapeB, edge, d) {
	        _classCallCheck(this, Contact);
	
	        this.shapeA = shapeA;
	        this.shapeB = shapeB;
	        this.edge = edge;
	        this.parseEdge(edge);
	        this.setDepth(d);
	    }
	
	    _createClass(Contact, [{
	        key: 'parseEdge',
	        value: function parseEdge(edge) {
	            // 提取最近边上的支撑点的来源顶点
	            var aA = edge.a.info.pair.A;
	            var bA = edge.b.info.pair.A;
	            var aB = edge.a.info.pair.B;
	            var bB = edge.b.info.pair.B;
	            if (aA.equal(bA)) {
	                // A上为碰撞点
	                this.featureA = {
	                    type: 'point',
	                    point: new _math.Vec2(aA.x, aA.y)
	                };
	            } else {
	                // A上为碰撞边
	                this.featureA = {
	                    type: 'edge',
	                    a: new _math.Vec2(aA.x, aA.y),
	                    b: new _math.Vec2(bA.x, bA.y)
	                };
	            }
	            if (aB.equal(bB)) {
	                // B上为碰撞点
	                this.featureB = {
	                    type: 'point',
	                    point: new _math.Vec2(aB.x, aB.y)
	                };
	            } else {
	                // B上为碰撞边
	                this.featureB = {
	                    type: 'edge',
	                    a: new _math.Vec2(aB.x, aB.y),
	                    b: new _math.Vec2(bB.x, bB.y)
	                };
	            }
	
	            this.normal = edge.normal;
	        }
	    }, {
	        key: 'setDepth',
	        value: function setDepth(d) {
	            this.depth = d;
	        }
	    }, {
	        key: 'draw',
	        value: function draw(ct) {
	            // 画出明克夫斯基差上离原点的最近边
	            ct.save();
	            ct.beginPath();
	            ct.moveTo(this.edge.a.x, this.edge.a.y);
	            ct.lineWidth = 4;
	            ct.strokeStyle = 'white';
	            ct.lineTo(this.edge.b.x, this.edge.b.y);
	            ct.stroke();
	            ct.restore();
	
	            ct.save();
	            // 画出A上的接触边/点
	            ct.beginPath();
	            if (this.featureA.type === 'point') {
	                ct.fillStyle = 'green';
	                ct.fillRect(this.featureA.point.x, this.featureA.point.y, 10, 10);
	            } else {
	                ct.moveTo(this.featureA.a.x, this.featureA.a.y);
	                ct.lineWidth = 4;
	                ct.strokeStyle = 'yellow';
	                ct.lineTo(this.featureA.b.x, this.featureA.b.y);
	                ct.stroke();
	            }
	            // 画出A上的接触边/点
	            ct.beginPath();
	            if (this.featureB.type === 'point') {
	                ct.fillStyle = 'green';
	                ct.fillRect(this.featureB.point.x, this.featureB.point.y, 10, 10);
	            } else {
	                ct.moveTo(this.featureB.a.x, this.featureB.a.y);
	                ct.lineWidth = 4;
	                ct.strokeStyle = 'yellow';
	                ct.lineTo(this.featureB.b.x, this.featureB.b.y);
	                ct.stroke();
	            }
	            ct.restore();
	
	            // 画出碰撞矢量(最短分离矢量)
	            ct.save();
	            ct.translate(this.shapeB.vertexes[0].x, this.shapeB.vertexes[0].y);
	            ct.beginPath();
	            ct.moveTo(0, 0);
	            ct.lineWidth = 2;
	            ct.strokeStyle = 'white';
	            var n = this.normal.mult(this.depth);
	            ct.lineTo(n.x, n.y);
	            ct.stroke();
	            ct.restore();
	        }
	    }]);
	
	    return Contact;
	}();
	
	exports.default = Contact;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _math = __webpack_require__(1);
	
	var _Simplex = __webpack_require__(8);
	
	var _Simplex2 = _interopRequireDefault(_Simplex);
	
	var _Contact = __webpack_require__(5);
	
	var _Contact2 = _interopRequireDefault(_Contact);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var TOLERANCE = 0.1;
	var ORIGIN = new _math.Vec2(0, 0);
	
	function EPA(shapeA, shapeB, simplex) {
	    // console.log('EPA start', shapeA, shapeB, simplex);
	    while (true) {
	        var edge = simplex.getClosestEdge(ORIGIN);
	        var p = (0, _math.support)(shapeA, shapeB, edge.normal);
	        var d = p.dot(edge.normal);
	        if (d - edge.distance < TOLERANCE) {
	            // return {
	            //     normal: edge.normal,
	            //     depth: d,
	            //     edge: edge,
	            // }
	            return new _Contact2.default(shapeA, shapeB, edge, d);
	        } else {
	            simplex.insert(p, edge.index);
	        }
	    }
	}
	
	exports.default = EPA;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.GJK = undefined;
	
	var _math = __webpack_require__(1);
	
	var _Simplex = __webpack_require__(8);
	
	var _Simplex2 = _interopRequireDefault(_Simplex);
	
	var _EPA = __webpack_require__(6);
	
	var _EPA2 = _interopRequireDefault(_EPA);
	
	var _Contact = __webpack_require__(5);
	
	var _Contact2 = _interopRequireDefault(_Contact);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function GJK(shapeA, shapeB) {
	    // console.warn('START GJK =============================');
	    // 闵可夫斯基差的单形
	    var simplex = new _Simplex2.default();
	    // window.simplex = simplex;
	    // 初始化支撑点方向
	    var d = new _math.Vec2(1, 0);
	    // 第一个支撑点
	    simplex.add((0, _math.support)(shapeA, shapeB, d));
	    // console.log('#0', JSON.stringify(simplex.vertexes));
	    d = d.getOpp();
	    while (true) {
	        // console.warn('LOOP =================================== ');
	        var flag = simplex.add((0, _math.support)(shapeA, shapeB, d));
	        simplex.draw(this.ct);
	        if (simplex.getLast().dot(d) <= 0) {
	            return false;
	        } else {
	            if (simplex.containsOrigion(d)) {
	                console.log('相交');
	                return (0, _EPA2.default)(shapeA, shapeB, simplex);
	            }
	        }
	    }
	    return false;
	}
	
	exports.GJK = GJK;
	exports.default = GJK;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // 单形
	
	var _math = __webpack_require__(1);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Simplex = function () {
	    function Simplex() {
	        _classCallCheck(this, Simplex);
	
	        this.vertexes = []; // 储存顶点
	    }
	
	    _createClass(Simplex, [{
	        key: 'draw',
	        value: function draw(ct) {
	            ct.save();
	            ct.beginPath();
	            ct.moveTo(this.vertexes[0].x, this.vertexes[0].y);
	            for (var i = 1; i < this.vertexes.length; i++) {
	                ct.lineTo(this.vertexes[i].x, this.vertexes[i].y);
	            }
	            ct.closePath();
	            ct.strokeStyle = 'red';
	            ct.lineWidth = 4;
	            ct.stroke();
	            // ct.fill();
	            ct.restore();
	        }
	    }, {
	        key: 'add',
	        value: function add(ver) {
	            // console.log('add', ver);
	            // let flag = true;
	            // this.vertexes.map(vec => {
	            //     if (vec.equal(ver)) {
	            //         console.error('添加重复顶点', vec);
	            //         // flag = false;
	            //     }
	            // })
	            // this.remove(ver);
	            // if (flag) {
	            this.vertexes.push(ver);
	            // return true;
	            // }
	            // else {
	            // return 1100;
	            // }
	        }
	    }, {
	        key: 'insert',
	        value: function insert(ver, index, pair) {
	            this.vertexes.splice(index, 0, ver);
	        }
	    }, {
	        key: 'remove',
	        value: function remove(b) {
	            // console.log('remove', b);
	            this.vertexes = this.vertexes.filter(function (ver) {
	                return !ver.equal(b);
	            });
	        }
	    }, {
	        key: 'getLast',
	        value: function getLast() {
	            return this.vertexes[this.vertexes.length - 1];
	        }
	    }, {
	        key: 'containsOrigion',
	        value: function containsOrigion(d) {
	            // console.log('containsOrigion: ', d);
	            var a = this.getLast();
	            var ao = a.getOpp();
	            if (this.vertexes.length === 3) {
	                var b = this.vertexes[1];
	                var c = this.vertexes[0];
	                var ab = b.sub(a);
	                var ac = c.sub(a);
	                var abPerp = (0, _math.vecTripleProduct)(ac, ab, ab);
	                var acPerp = (0, _math.vecTripleProduct)(ab, ac, ac);
	                // console.log('#9', a, b, c, ab, ac, abPerp, acPerp);
	                if (abPerp.dot(ao) > 0) {
	                    this.remove(c);
	                    // console.log('#4', d);
	                    d.set(abPerp.x, abPerp.y);
	                    // console.log('#5', d);
	                } else {
	                    if (acPerp.dot(ao) > 0) {
	                        this.remove(b);
	                        // console.log('#6', d);
	                        d.set(acPerp.x, acPerp.y);
	                        // console.log('#7', d);
	                    } else {
	                        return true;
	                    }
	                }
	            } else {
	                var _b = this.vertexes[0];
	                var _ab = _b.sub(a);
	                var _abPerp = (0, _math.vecTripleProduct)(_ab, ao, _ab);
	                d.set(_abPerp.x, _abPerp.y);
	            }
	            return false;
	        }
	    }, {
	        key: 'getClosestEdge',
	        value: function getClosestEdge(p) {
	            // console.log('getClosestEdge', p);
	            var edge = {
	                distance: Number.POSITIVE_INFINITY,
	                index: 0,
	                normal: 0,
	                a: null,
	                b: null
	            };
	            for (var i = 0; i < this.vertexes.length; i++) {
	                // console.log('LOOP');
	                var j = i + 1 == this.vertexes.length ? 0 : i + 1;
	                var a = this.vertexes[i];
	                var b = this.vertexes[j];
	                // let d = getDisPointLine(p, a, b);
	                // 线向量
	                var ab = b.sub(a);
	                // 点到端点的向量
	                var pa = a.sub(p);
	                // 点到线的垂线
	                var n = (0, _math.vecTripleProduct)(ab, pa, ab);
	                // console.log('#0', n);
	                if (n.isZero()) {
	                    edge.distance = 0;
	                    edge.index = j;
	                    edge.normal = n;
	                    return edge;
	                };
	                n = n.unit();
	                // console.log('#1', n);
	                // 距离
	                var d = n.dot(a);
	                // console.log('#2', d);
	
	                if (d < edge.distance) {
	                    edge.distance = d;
	                    edge.index = j;
	                    edge.normal = n;
	                    edge.a = a;
	                    edge.b = b;
	                }
	            }
	            return edge;
	        }
	    }]);
	
	    return Simplex;
	}();
	
	exports.default = Simplex;

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = ansiHTML;
	
	// Reference to https://github.com/sindresorhus/ansi-regex
	var re_ansi = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/;
	
	var _defColors = {
	  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
	  black: '000',
	  red: 'ff0000',
	  green: '209805',
	  yellow: 'e8bf03',
	  blue: '0000ff',
	  magenta: 'ff00ff',
	  cyan: '00ffee',
	  lightgrey: 'f0f0f0',
	  darkgrey: '888'
	};
	var _styles = {
	  30: 'black',
	  31: 'red',
	  32: 'green',
	  33: 'yellow',
	  34: 'blue',
	  35: 'magenta',
	  36: 'cyan',
	  37: 'lightgrey'
	};
	var _openTags = {
	  '1': 'font-weight:bold', // bold
	  '2': 'opacity:0.8', // dim
	  '3': '<i>', // italic
	  '4': '<u>', // underscore
	  '8': 'display:none', // hidden
	  '9': '<del>', // delete
	};
	var _closeTags = {
	  '23': '</i>', // reset italic
	  '24': '</u>', // reset underscore
	  '29': '</del>' // reset delete
	};
	[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
	  _closeTags[n] = '</span>';
	});
	
	/**
	 * Converts text with ANSI color codes to HTML markup.
	 * @param {String} text
	 * @returns {*}
	 */
	function ansiHTML(text) {
	  // Returns the text if the string has no ANSI escape code.
	  if (!re_ansi.test(text)) {
	    return text;
	  }
	
	  // Cache opened sequence.
	  var ansiCodes = [];
	  // Replace with markup.
	  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
	    var ot = _openTags[seq];
	    if (ot) {
	      // If current sequence has been opened, close it.
	      if (!!~ansiCodes.indexOf(seq)) {
	        ansiCodes.pop();
	        return '</span>';
	      }
	      // Open tag.
	      ansiCodes.push(seq);
	      return ot[0] == '<' ? ot : '<span style="' + ot + ';">';
	    }
	
	    var ct = _closeTags[seq];
	    if (ct) {
	      // Pop sequence
	      ansiCodes.pop();
	      return ct;
	    }
	    return '';
	  });
	
	  // Make sure tags are closed.
	  var l = ansiCodes.length;
	  (l > 0) && (ret += Array(l + 1).join('</span>'));
	
	  return ret;
	}
	
	/**
	 * Customize colors.
	 * @param {Object} colors reference to _defColors
	 */
	ansiHTML.setColors = function (colors) {
	  if (typeof colors != 'object') {
	    throw new Error('`colors` parameter must be an Object.');
	  }
	
	  var _finalColors = {};
	  for (var key in _defColors) {
	    var hex = colors.hasOwnProperty(key) ? colors[key] : null;
	    if (!hex) {
	      _finalColors[key] = _defColors[key];
	      continue;
	    }
	    if ('reset' == key) {
	    	if(typeof hex == 'string'){
	    		hex = [hex];
	    	}
	      if (!Array.isArray(hex) || hex.length == 0 || hex.some(function (h) {
	          return typeof h != 'string';
	        })) {
	        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000');
	      }
	      var defHexColor = _defColors[key];
	      if(!hex[0]){
	      	hex[0] = defHexColor[0];
	      }
	      if (hex.length == 1 || !hex[1]) {
	      	hex = [hex[0]];
	        hex.push(defHexColor[1]);
	      }
	
	      hex = hex.slice(0, 2);
	    } else if (typeof hex != 'string') {
	      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000');
	    }
	    _finalColors[key] = hex;
	  }
	  _setTags(_finalColors);
	};
	
	/**
	 * Reset colors.
	 */
	ansiHTML.reset = function(){
		_setTags(_defColors);
	};
	
	/**
	 * Expose tags, including open and close.
	 * @type {Object}
	 */
	ansiHTML.tags = {
	  get open() {
	    return _openTags;
	  },
	  get close() {
	    return _closeTags;
	  }
	};
	
	function _setTags(colors) {
	  // reset all
	  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1];
	  // inverse
	  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0];
	  // dark grey
	  _openTags['90'] = 'color:#' + colors.darkgrey;
	
	  for (var code in _styles) {
	    var color = _styles[code];
	    var oriColor = colors[color] || '000';
	    _openTags[code] = 'color:#' + oriColor;
	    code = parseInt(code);
	    _openTags[(code + 10).toString()] = 'background:#' + oriColor;
	  }
	}
	
	ansiHTML.reset();


/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	module.exports = function () {
		return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Box = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Base2 = __webpack_require__(2);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Box = exports.Box = function (_Base) {
	    _inherits(Box, _Base);
	
	    function Box(x1, x2, y1, y2, restitution) {
	        _classCallCheck(this, Box);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Box).call(this, 0, 0));
	
	        _this.zone = [x1, x2, y1, y2];
	        _this.restitution = restitution;
	        return _this;
	    }
	
	    _createClass(Box, [{
	        key: 'getBounds',
	        value: function getBounds() {
	            return {
	                type: 'box',
	                zone: this.zone,
	                restitution: this.restitution
	            };
	        }
	    }]);

	    return Box;
	}(_Base2.Base);

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Circle = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Base2 = __webpack_require__(2);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 桌球
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author Simon
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @create 2016-08-12
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
	
	var Circle = exports.Circle = function (_Base) {
	    _inherits(Circle, _Base);
	
	    function Circle(x, y, radius) {
	        _classCallCheck(this, Circle);
	
	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Circle).call(this, x, y));
	
	        _this.radius = radius;
	        return _this;
	    }
	
	    _createClass(Circle, [{
	        key: 'draw',
	        value: function draw(ct) {
	            ct.save();
	            ct.translate(this.x, this.y);
	            ct.rotate(this.rotate);
	            ct.scale(this.scale, this.scale);
	
	            ct.beginPath();
	            ct.arc(0, 0, this.radius, 0, Math.PI * 2, true);
	            ct.closePath();
	
	            // 投影
	            ct.shadowOffsetX = 1;
	            ct.shadowOffsetY = 1;
	            ct.shadowBlur = 4;
	            ct.shadowColor = "rgba(0, 0, 0, 0.2)";
	
	            // 边框
	            // ct.strokeStyle = this.strokeStyle;
	            // ct.lineWidth = this.lineWidth;
	            // ct.stroke();
	
	            // 基本颜色
	            ct.fillStyle = this.fillStyle;
	            ct.fill();
	
	            // 阴影
	            var radgrad = ct.createRadialGradient(-this.radius / 2, -this.radius / 2, this.radius * 2, -this.radius / 3, -this.radius / 3, 3);
	            radgrad.addColorStop(0, 'rgba(255,255,255,0)');
	            radgrad.addColorStop(0.1, 'rgba(255,255,255,0)');
	            radgrad.addColorStop(0.5, 'rgba(255,255,255,0.1)');
	            radgrad.addColorStop(0.7, 'rgba(255,255,255,0.3)');
	            radgrad.addColorStop(0.85, 'rgba(255,255,255,0.6)');
	            radgrad.addColorStop(1, 'rgba(255,255,255,0.8)');
	            ct.fillStyle = radgrad;
	            ct.fill();
	
	            ct.restore();
	
	            // 显示速度辅助线
	            // ct.save();
	            // ct.translate(this.x, this.y);
	            // ct.lineWidth = 1;
	            // ct.strokeStyle = 'red';
	            // ct.beginPath();
	            // ct.moveTo(0, 0);
	            // ct.lineTo(this.vx * 5, this.vy * 5);
	            // ct.stroke();
	            // ct.restore();
	        }
	    }, {
	        key: 'destory',
	        value: function destory() {
	            this.dead = true;
	        }
	    }, {
	        key: 'getBounds',
	        value: function getBounds() {
	            return {
	                type: 'arc',
	                x: this.x,
	                y: this.y,
	                radius: this.radius
	            };
	        }
	    }]);

	    return Circle;
	}(_Base2.Base);

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  XmlEntities: __webpack_require__(15),
	  Html4Entities: __webpack_require__(14),
	  Html5Entities: __webpack_require__(3),
	  AllHtmlEntities: __webpack_require__(3)
	};


/***/ },
/* 14 */
/***/ function(module, exports) {

	var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'Oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'oelig', 'oelig', 'scaron', 'scaron', 'yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
	var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];
	
	var alphaIndex = {};
	var numIndex = {};
	
	var i = 0;
	var length = HTML_ALPHA.length;
	while (i < length) {
	    var a = HTML_ALPHA[i];
	    var c = HTML_CODES[i];
	    alphaIndex[a] = String.fromCharCode(c);
	    numIndex[c] = a;
	    i++;
	}
	
	/**
	 * @constructor
	 */
	function Html4Entities() {}
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.prototype.decode = function(str) {
	    if (str.length === 0) {
	        return '';
	    }
	    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
	        var chr;
	        if (entity.charAt(0) === "#") {
	            var code = entity.charAt(1).toLowerCase() === 'x' ?
	                parseInt(entity.substr(2), 16) :
	                parseInt(entity.substr(1));
	
	            if (!(isNaN(code) || code < -32768 || code > 65535)) {
	                chr = String.fromCharCode(code);
	            }
	        } else {
	            chr = alphaIndex[entity];
	        }
	        return chr || s;
	    });
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.decode = function(str) {
	    return new Html4Entities().decode(str);
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.prototype.encode = function(str) {
	    var strLength = str.length;
	    if (strLength === 0) {
	        return '';
	    }
	    var result = '';
	    var i = 0;
	    while (i < strLength) {
	        var alpha = numIndex[str.charCodeAt(i)];
	        result += alpha ? "&" + alpha + ";" : str.charAt(i);
	        i++;
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.encode = function(str) {
	    return new Html4Entities().encode(str);
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.prototype.encodeNonUTF = function(str) {
	    var strLength = str.length;
	    if (strLength === 0) {
	        return '';
	    }
	    var result = '';
	    var i = 0;
	    while (i < strLength) {
	        var cc = str.charCodeAt(i);
	        var alpha = numIndex[cc];
	        if (alpha) {
	            result += "&" + alpha + ";";
	        } else if (cc < 32 || cc > 126) {
	            result += "&#" + cc + ";";
	        } else {
	            result += str.charAt(i);
	        }
	        i++;
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.encodeNonUTF = function(str) {
	    return new Html4Entities().encodeNonUTF(str);
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.prototype.encodeNonASCII = function(str) {
	    var strLength = str.length;
	    if (strLength === 0) {
	        return '';
	    }
	    var result = '';
	    var i = 0;
	    while (i < strLength) {
	        var c = str.charCodeAt(i);
	        if (c <= 255) {
	            result += str[i++];
	            continue;
	        }
	        result += '&#' + c + ';';
	        i++;
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.encodeNonASCII = function(str) {
	    return new Html4Entities().encodeNonASCII(str);
	};
	
	module.exports = Html4Entities;


/***/ },
/* 15 */
/***/ function(module, exports) {

	var ALPHA_INDEX = {
	    '&lt': '<',
	    '&gt': '>',
	    '&quot': '"',
	    '&apos': '\'',
	    '&amp': '&',
	    '&lt;': '<',
	    '&gt;': '>',
	    '&quot;': '"',
	    '&apos;': '\'',
	    '&amp;': '&'
	};
	
	var CHAR_INDEX = {
	    60: 'lt',
	    62: 'gt',
	    34: 'quot',
	    39: 'apos',
	    38: 'amp'
	};
	
	var CHAR_S_INDEX = {
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    '\'': '&apos;',
	    '&': '&amp;'
	};
	
	/**
	 * @constructor
	 */
	function XmlEntities() {}
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	XmlEntities.prototype.encode = function(str) {
	    if (str.length === 0) {
	        return '';
	    }
	    return str.replace(/<|>|"|'|&/g, function(s) {
	        return CHAR_S_INDEX[s];
	    });
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 XmlEntities.encode = function(str) {
	    return new XmlEntities().encode(str);
	 };
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	XmlEntities.prototype.decode = function(str) {
	    if (str.length === 0) {
	        return '';
	    }
	    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
	        if (s.charAt(1) === '#') {
	            var code = s.charAt(2).toLowerCase() === 'x' ?
	                parseInt(s.substr(3), 16) :
	                parseInt(s.substr(2));
	
	            if (isNaN(code) || code < -32768 || code > 65535) {
	                return '';
	            }
	            return String.fromCharCode(code);
	        }
	        return ALPHA_INDEX[s] || s;
	    });
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 XmlEntities.decode = function(str) {
	    return new XmlEntities().decode(str);
	 };
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	XmlEntities.prototype.encodeNonUTF = function(str) {
	    var strLength = str.length;
	    if (strLength === 0) {
	        return '';
	    }
	    var result = '';
	    var i = 0;
	    while (i < strLength) {
	        var c = str.charCodeAt(i);
	        var alpha = CHAR_INDEX[c];
	        if (alpha) {
	            result += "&" + alpha + ";";
	            i++;
	            continue;
	        }
	        if (c < 32 || c > 126) {
	            result += '&#' + c + ';';
	        } else {
	            result += str.charAt(i);
	        }
	        i++;
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 XmlEntities.encodeNonUTF = function(str) {
	    return new XmlEntities().encodeNonUTF(str);
	 };
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	XmlEntities.prototype.encodeNonASCII = function(str) {
	    var strLenght = str.length;
	    if (strLenght === 0) {
	        return '';
	    }
	    var result = '';
	    var i = 0;
	    while (i < strLenght) {
	        var c = str.charCodeAt(i);
	        if (c <= 255) {
	            result += str[i++];
	            continue;
	        }
	        result += '&#' + c + ';';
	        i++;
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 XmlEntities.encodeNonASCII = function(str) {
	    return new XmlEntities().encodeNonASCII(str);
	 };
	
	module.exports = XmlEntities;


/***/ },
/* 16 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	'use strict';
	
	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	
	module.exports = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};
	
	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }
	
	  var regexp = /\+/g;
	  qs = qs.split(sep);
	
	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }
	
	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }
	
	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;
	
	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }
	
	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);
	
	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (Array.isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }
	
	  return obj;
	};


/***/ },
/* 17 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	'use strict';
	
	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;
	
	    case 'boolean':
	      return v ? 'true' : 'false';
	
	    case 'number':
	      return isFinite(v) ? v : '';
	
	    default:
	      return '';
	  }
	};
	
	module.exports = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }
	
	  if (typeof obj === 'object') {
	    return Object.keys(obj).map(function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (Array.isArray(obj[k])) {
	        return obj[k].map(function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);
	
	  }
	
	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.decode = exports.parse = __webpack_require__(16);
	exports.encode = exports.stringify = __webpack_require__(17);


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ansiRegex = __webpack_require__(10)();
	
	module.exports = function (str) {
		return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
	};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/*eslint-env browser*/
	
	var clientOverlay = document.createElement('div');
	var styles = {
	  background: 'rgba(0,0,0,0.85)',
	  color: '#E8E8E8',
	  lineHeight: '1.2',
	  whiteSpace: 'pre',
	  fontFamily: 'Menlo, Consolas, monospace',
	  fontSize: '13px',
	  position: 'fixed',
	  zIndex: 9999,
	  padding: '10px',
	  left: 0,
	  right: 0,
	  top: 0,
	  bottom: 0,
	  overflow: 'auto',
	  dir: 'ltr'
	};
	for (var key in styles) {
	  clientOverlay.style[key] = styles[key];
	}
	
	var ansiHTML = __webpack_require__(9);
	var colors = {
	  reset: ['transparent', 'transparent'],
	  black: '181818',
	  red: 'E36049',
	  green: 'B3CB74',
	  yellow: 'FFD080',
	  blue: '7CAFC2',
	  magenta: '7FACCA',
	  cyan: 'C3C2EF',
	  lightgrey: 'EBE7E3',
	  darkgrey: '6D7891'
	};
	ansiHTML.setColors(colors);
	
	var Entities = __webpack_require__(13).AllHtmlEntities;
	var entities = new Entities();
	
	exports.showProblems =
	function showProblems(type, lines) {
	  clientOverlay.innerHTML = '';
	  lines.forEach(function(msg) {
	    msg = ansiHTML(entities.encode(msg));
	    var div = document.createElement('div');
	    div.style.marginBottom = '26px';
	    div.innerHTML = problemType(type) + ' in ' + msg;
	    clientOverlay.appendChild(div);
	  });
	  if (document.body) {
	    document.body.appendChild(clientOverlay);
	  }
	};
	
	exports.clear =
	function clear() {
	  if (document.body && clientOverlay.parentNode) {
	    document.body.removeChild(clientOverlay);
	  }
	};
	
	var problemColors = {
	  errors: colors.red,
	  warnings: colors.yellow
	};
	
	function problemType (type) {
	  var color = problemColors[type] || colors.red;
	  return (
	    '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' +
	      type.slice(0, -1).toUpperCase() +
	    '</span>'
	  );
	}


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__resourceQuery, module) {/*eslint-env browser*/
	/*global __resourceQuery __webpack_public_path__*/
	
	var options = {
	  path: "/__webpack_hmr",
	  timeout: 20 * 1000,
	  overlay: true,
	  reload: false,
	  log: true,
	  warn: true
	};
	if (true) {
	  var querystring = __webpack_require__(18);
	  var overrides = querystring.parse(__resourceQuery.slice(1));
	  if (overrides.path) options.path = overrides.path;
	  if (overrides.timeout) options.timeout = overrides.timeout;
	  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
	  if (overrides.reload) options.reload = overrides.reload !== 'false';
	  if (overrides.noInfo && overrides.noInfo !== 'false') {
	    options.log = false;
	  }
	  if (overrides.quiet && overrides.quiet !== 'false') {
	    options.log = false;
	    options.warn = false;
	  }
	  if (overrides.dynamicPublicPath) {
	    options.path = __webpack_require__.p + options.path;
	  }
	}
	
	if (typeof window === 'undefined') {
	  // do nothing
	} else if (typeof window.EventSource === 'undefined') {
	  console.warn(
	    "webpack-hot-middleware's client requires EventSource to work. " +
	    "You should include a polyfill if you want to support this browser: " +
	    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
	  );
	} else {
	  connect(window.EventSource);
	}
	
	function connect(EventSource) {
	  var source = new EventSource(options.path);
	  var lastActivity = new Date();
	
	  source.onopen = handleOnline;
	  source.onmessage = handleMessage;
	  source.onerror = handleDisconnect;
	
	  var timer = setInterval(function() {
	    if ((new Date() - lastActivity) > options.timeout) {
	      handleDisconnect();
	    }
	  }, options.timeout / 2);
	
	  function handleOnline() {
	    if (options.log) console.log("[HMR] connected");
	    lastActivity = new Date();
	  }
	
	  function handleMessage(event) {
	    lastActivity = new Date();
	    if (event.data == "\uD83D\uDC93") {
	      return;
	    }
	    try {
	      processMessage(JSON.parse(event.data));
	    } catch (ex) {
	      if (options.warn) {
	        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
	      }
	    }
	  }
	
	  function handleDisconnect() {
	    clearInterval(timer);
	    source.close();
	    setTimeout(function() { connect(EventSource); }, options.timeout);
	  }
	
	}
	
	var reporter;
	// the reporter needs to be a singleton on the page
	// in case the client is being used by mutliple bundles
	// we only want to report once.
	// all the errors will go to all clients
	var singletonKey = '__webpack_hot_middleware_reporter__';
	if (typeof window !== 'undefined' && !window[singletonKey]) {
	  reporter = window[singletonKey] = createReporter();
	}
	
	function createReporter() {
	  var strip = __webpack_require__(19);
	
	  var overlay;
	  if (typeof document !== 'undefined' && options.overlay) {
	    overlay = __webpack_require__(20);
	  }
	
	  return {
	    problems: function(type, obj) {
	      if (options.warn) {
	        console.warn("[HMR] bundle has " + type + ":");
	        obj[type].forEach(function(msg) {
	          console.warn("[HMR] " + strip(msg));
	        });
	      }
	      if (overlay && type !== 'warnings') overlay.showProblems(type, obj[type]);
	    },
	    success: function() {
	      if (overlay) overlay.clear();
	    },
	    useCustomOverlay: function(customOverlay) {
	      overlay = customOverlay;
	    }
	  };
	}
	
	var processUpdate = __webpack_require__(22);
	
	var customHandler;
	var subscribeAllHandler;
	function processMessage(obj) {
	  if (obj.action == "building") {
	    if (options.log) console.log("[HMR] bundle rebuilding");
	  } else if (obj.action == "built") {
	    if (options.log) {
	      console.log(
	        "[HMR] bundle " + (obj.name ? obj.name + " " : "") +
	        "rebuilt in " + obj.time + "ms"
	      );
	    }
	    if (obj.errors.length > 0) {
	      if (reporter) reporter.problems('errors', obj);
	    } else {
	      if (reporter) {
	        if (obj.warnings.length > 0) reporter.problems('warnings', obj);
	        reporter.success();
	      }
	
	      processUpdate(obj.hash, obj.modules, options);
	    }
	  } else if (customHandler) {
	    customHandler(obj);
	  }
	
	  if (subscribeAllHandler) {
	    subscribeAllHandler(obj);
	  }
	}
	
	if (module) {
	  module.exports = {
	    subscribeAll: function subscribeAll(handler) {
	      subscribeAllHandler = handler;
	    },
	    subscribe: function subscribe(handler) {
	      customHandler = handler;
	    },
	    useCustomOverlay: function useCustomOverlay(customOverlay) {
	      if (reporter) reporter.useCustomOverlay(customOverlay);
	    }
	  };
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, "?reload=true", __webpack_require__(23)(module)))

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Based heavily on https://github.com/webpack/webpack/blob/
	 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
	 * Original copyright Tobias Koppers @sokra (MIT license)
	 */
	
	/* global window __webpack_hash__ */
	
	if (false) {
	  throw new Error("[HMR] Hot Module Replacement is disabled.");
	}
	
	var hmrDocsUrl = "http://webpack.github.io/docs/hot-module-replacement-with-webpack.html"; // eslint-disable-line max-len
	
	var lastHash;
	var failureStatuses = { abort: 1, fail: 1 };
	var applyOptions = { ignoreUnaccepted: true };
	
	function upToDate(hash) {
	  if (hash) lastHash = hash;
	  return lastHash == __webpack_require__.h();
	}
	
	module.exports = function(hash, moduleMap, options) {
	  var reload = options.reload;
	  if (!upToDate(hash) && module.hot.status() == "idle") {
	    if (options.log) console.log("[HMR] Checking for updates on the server...");
	    check();
	  }
	
	  function check() {
	    var cb = function(err, updatedModules) {
	      if (err) return handleError(err);
	
	      if(!updatedModules) {
	        if (options.warn) {
	          console.warn("[HMR] Cannot find update (Full reload needed)");
	          console.warn("[HMR] (Probably because of restarting the server)");
	        }
	        performReload();
	        return null;
	      }
	
	      var applyCallback = function(applyErr, renewedModules) {
	        if (applyErr) return handleError(applyErr);
	
	        if (!upToDate()) check();
	
	        logUpdates(updatedModules, renewedModules);
	      };
	
	      var applyResult = module.hot.apply(applyOptions, applyCallback);
	      // webpack 2 promise
	      if (applyResult && applyResult.then) {
	        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
	        applyResult.then(function(outdatedModules) {
	          applyCallback(null, outdatedModules);
	        });
	        applyResult.catch(applyCallback);
	      }
	
	    };
	
	    var result = module.hot.check(false, cb);
	    // webpack 2 promise
	    if (result && result.then) {
	        result.then(function(updatedModules) {
	            cb(null, updatedModules);
	        });
	        result.catch(cb);
	    }
	  }
	
	  function logUpdates(updatedModules, renewedModules) {
	    var unacceptedModules = updatedModules.filter(function(moduleId) {
	      return renewedModules && renewedModules.indexOf(moduleId) < 0;
	    });
	
	    if(unacceptedModules.length > 0) {
	      if (options.warn) {
	        console.warn(
	          "[HMR] The following modules couldn't be hot updated: " +
	          "(Full reload needed)\n" +
	          "This is usually because the modules which have changed " +
	          "(and their parents) do not know how to hot reload themselves. " +
	          "See " + hmrDocsUrl + " for more details."
	        );
	        unacceptedModules.forEach(function(moduleId) {
	          console.warn("[HMR]  - " + moduleMap[moduleId]);
	        });
	      }
	      performReload();
	      return;
	    }
	
	    if (options.log) {
	      if(!renewedModules || renewedModules.length === 0) {
	        console.log("[HMR] Nothing hot updated.");
	      } else {
	        console.log("[HMR] Updated modules:");
	        renewedModules.forEach(function(moduleId) {
	          console.log("[HMR]  - " + moduleMap[moduleId]);
	        });
	      }
	
	      if (upToDate()) {
	        console.log("[HMR] App is up to date.");
	      }
	    }
	  }
	
	  function handleError(err) {
	    if (module.hot.status() in failureStatuses) {
	      if (options.warn) {
	        console.warn("[HMR] Cannot check for update (Full reload needed)");
	        console.warn("[HMR] " + err.stack || err.message);
	      }
	      performReload();
	      return;
	    }
	    if (options.warn) {
	      console.warn("[HMR] Update check failed: " + err.stack || err.message);
	    }
	  }
	
	  function performReload() {
	    if (reload) {
	      if (options.warn) console.warn("[HMR] Reloading page");
	      window.location.reload();
	    }
	  }
	};


/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Engine = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 物理引擎
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Simon
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @create 2016-08-12
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */
	
	var _Base = __webpack_require__(2);
	
	var _Circle = __webpack_require__(12);
	
	var _Box = __webpack_require__(11);
	
	var _mouse = __webpack_require__(25);
	
	var _traverse = __webpack_require__(26);
	
	var _tool = __webpack_require__(4);
	
	var _GJK = __webpack_require__(7);
	
	var _colRouter = __webpack_require__(29);
	
	var _hooke = __webpack_require__(32);
	
	var _gravity = __webpack_require__(31);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Engine = function () {
	    /**
	     * 构造函数
	     * @method constructor
	     * @param  {Element}       canvas       图层canvas元素
	     * @param  {[Int]}         samsaraCount 每帧的轮回数, 默认为1
	     * @param  {[Bool|String]} autoFreqMode 动态调频模式 false|'turbo'|'balance', default:'balance'
	     * @param  {[Bool]}        wheel        是够监听鼠标滚轮和方向键, 进行缩放和移动
	     */
	    function Engine(canvas) {
	        var samsaraCount = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
	        var autoFreqMode = arguments.length <= 2 || arguments[2] === undefined ? 'balance' : arguments[2];
	        var zoomRpan = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];
	
	        _classCallCheck(this, Engine);
	
	        // 主图层
	        this.canvas = canvas;
	        this.ct = canvas.getContext('2d');
	        // 辅助线专用图层 ** 辅助线绘制单独开一个图层性能不好, 已取消
	        this.ctHelperAvailable = true; // 用于降低辅助线图层的刷新率, 以免拖慢整体刷新率
	
	        // 每帧的轮回数
	        this.samsaraCount = samsaraCount;
	        this.maxSamsaraCount = samsaraCount;
	
	        // 自动调频/性能监控
	        this.autoFreqMode = autoFreqMode;
	        this._bufferFrameCycle = [];
	        this._bufferFunCycle = [];
	        this._autoFreqTimmer = 0;
	        this._frameTimestamp = 0;
	
	        // 初始化
	        this.entities = [];
	        this.groups = [];
	        this._onRun = false;
	        this._timmer = 0;
	        this.laws = [];
	        this.mouse = _mouse.getCursor.bind(this)();
	        this.origin = { x: 0, y: 0 };
	        this.scale = 1;
	
	        // 滚轮缩放和方向键平移
	        if (zoomRpan) {
	            _mouse.zoomAndPan.bind(this)();
	        }
	
	        /**
	         * 添加函数
	         */
	        this.draftSimple = _mouse.draftSimple.bind(this);
	        this.draftEase = _mouse.draftEase.bind(this);
	        this.draftBungee = _mouse.draftBungee.bind(this);
	        this.between = _traverse.between.bind(this);
	        this.among = _traverse.among.bind(this);
	        this.useElasticCollision = _colRouter.useElasticCollision.bind(this);
	        this.userPICollision = _colRouter.userPICollision.bind(this);
	        this.spring = _hooke.spring.bind(this);
	        this.uGrav = _gravity.uGrav.bind(this);
	        this.autoFreq = _tool.autoFreq.bind(this);
	        this.GJK = _GJK.GJK.bind(this);
	    }
	
	    /**
	     * 向当前画布添加 实体
	     * - 参数为实体对象构成的数组
	     * - 副作用: 参数被加上'__GUID'属性
	     * @method add
	     * @param  {Array(Base)} ent 要添加的实体列表
	     */
	
	
	    _createClass(Engine, [{
	        key: 'add',
	        value: function add() {
	            var _this = this;
	
	            for (var _len = arguments.length, ents = Array(_len), _key = 0; _key < _len; _key++) {
	                ents[_key] = arguments[_key];
	            }
	
	            ents.map(function (ent) {
	                _this.groups.push(ent);
	                _this.entities = _this.entities.concat(ent);
	            });
	        }
	
	        /**
	         * 删除被标记为dead的实体
	         * - 副作用: 直接修改了上面add的传入值
	         * @method clean
	         */
	
	    }, {
	        key: 'clean',
	        value: function clean() {
	            this.groups.map(function (group) {
	                var toDel = group.map(function (entity, index) {
	                    return entity.dead ? index : false;
	                }).filter(function (key) {
	                    return key !== false;
	                });
	                toDel.length > 0 && toDel.sort(function (a, b) {
	                    return b - a;
	                });
	                toDel.map(function (index) {
	                    return group.splice(index, 1);
	                });
	            });
	            this.entities = this.groups.reduce(function (pre, cur) {
	                return pre.concat(cur);
	            }, []);
	        }
	
	        /**
	         * 开始运行
	         * @method run
	         */
	
	    }, {
	        key: 'run',
	        value: function run() {
	            var _this2 = this;
	
	            // 轮回 !!!
	            var samsara = function samsara() {
	                var entities = _this2.entities;
	                // 1. 运行物理定律
	                // 1.1 a=F/m, F是瞬时的, 如果物理定律中没有其他影响, a应该立即置0
	                entities.map(function (entity) {
	                    return entity.ax = entity.ay = 0;
	                });
	                // 1.2 执行所有注册了的物理定律/游戏规则
	                _this2.laws.map(function (law) {
	                    law();
	                });
	                // 2. 执行每个实体自己的动作
	                entities.map(function (entity) {
	                    if (entity.behavior) {
	                        entity.behavior();
	                    }
	                });
	                // 3. 执行运动
	                entities.map(function (entity) {
	                    if (!entity.__catched) {
	                        entity.move(_this2.samsaraCount);
	                    }
	                });
	                // * 辅助线降频, 控制辅助线每帧只绘制一次, 以免影响性能
	                _this2.ctHelperAvailable = false;
	            };
	
	            // 帧
	            var frame = function frame() {
	                // 4. 动画
	                _this2.timmer = window.requestAnimationFrame(frame);
	                // * 帧率监控
	                var now = new Date().getTime();
	                var frameCycle = now - _this2._frameTimestamp;
	                _this2._frameTimestamp = now;
	                // 1. 绘制当前实体
	                _this2.ct.save();
	
	                // 1.1.a 拖影效果
	                // this.ct.fillStyle = 'rgba(0, 0, 0, 0.1)';
	                // this.ct.fillRect(0, 0, this.canvas.width, this.canvas.height);
	                // 1.1.b 无拖影效果
	                _this2.ct.clearRect(0, 0, _this2.canvas.width, _this2.canvas.height);
	                // 1.2 使全局缩放和偏移生效
	                _this2.ct.scale(_this2.scale, _this2.scale);
	                _this2.ct.translate(_this2.origin.x, _this2.origin.y);
	                // 1.3 绘制add过的所有实体
	                _this2.entities.map(function (entity) {
	                    return entity.draw(_this2.ct);
	                });
	                // 2. 执行轮回
	                _this2.ctHelperAvailable = true; // 辅助线降频
	                for (var i = 0; i < _this2.samsaraCount; i++) {
	                    try {
	                        samsara();
	                    } catch (e) {
	                        _this2.stop();
	                        throw e;
	                    }
	                }
	                // 3. 自动调频
	                _this2.autoFreq(frameCycle);
	                _this2.ct.restore();
	            };
	            this.timmer = window.requestAnimationFrame(frame);
	            // this.timmer = window.setInterval(frame, 5);
	        }
	    }, {
	        key: 'stop',
	        value: function stop() {
	            window.cancelAnimationFrame(this.timmer);
	        }
	    }, {
	        key: 'step',
	        value: function step() {
	            this.run();
	            this.stop();
	        }
	
	        /**
	         * 添加物理定律
	         * 在每个轮回(每一帧)运行
	         * @method addLaw
	         */
	
	    }, {
	        key: 'addLaw',
	        value: function addLaw(law) {
	            this.laws.push(law);
	        }
	    }]);
	
	    return Engine;
	}();
	
	// ES6中没有静态属性(ES7中有, 但是chrome目前无法直接支持)
	
	
	Engine.Base = _Base.Base;
	Engine.Circle = _Circle.Circle;
	Engine.Box = _Box.Box;
	
	exports.Engine = Engine;
	
	// Engine.Group = class Group {
	//     constructor() {
	//         this.array = [];
	//         this.__GUID = Engine.__getID();
	//     }
	//
	//     push(entity) {
	//         this.array.push(entity);
	//     }
	//     shift(entity) {
	//         this.array.shift(entity);
	//     }
	//     unshift(entity) {
	//         this.array.unshift(entity);
	//     }
	//
	//     getArray() {
	//         return this.array.filter(ent => !ent.dead);
	//     }
	//
	//     clean() {
	//         this.array = this.array.filter(ent => !ent.dead);
	//     }
	// }

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.zoomAndPan = exports.draftBungee = exports.draftEase = exports.draftSimple = exports.getCursor = exports.ifPointIn = undefined;
	
	var _math = __webpack_require__(1);
	
	/**
	 * 检测点是否落在边界内
	 * @method ifPointIn
	 * @param  {{x,y}}   point     点坐标
	 * @param  {Bounds}  objBounds 边界
	 * @return {Bool}
	 */
	function ifPointIn(point, objBounds) {
	    if (objBounds.type === 'arc') {
	        // 判断圆心距离
	        return (0, _math.getDistance)(point, objBounds) <= objBounds.radius;
	    }
	}
	
	/**
	 * 获取鼠标对象, 并实时更新
	 * @method getCursor
	 * @param  {Element}  elm 要监控的元素
	 * @return {Mouse}
	 */
	/**
	 * 鼠标事件处理
	 * 拖拽
	 * 滚轮
	 * 方向键
	 * **所有this指向物理引擎的实例, 注意bind
	 */
	
	function getCursor() {
	    var _this = this;
	
	    var elm = this.canvas;
	    var mouse = {
	        x: 0, // 鼠标x(相对于传入元素)
	        y: 0, // 鼠标y(相对于传入元素)
	        down: false, // 鼠标按下状态
	        lockOn: null, // 鼠标点击锁定, 避免速度过快移出物体造成拖动丢失
	        justClicked: false };
	    // addEventListener 如果重复, 重复的会被自动抛弃, 不用担心多次执行
	    elm.addEventListener('mousemove', function (event) {
	        mouse.x = (event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - elm.offsetLeft) / _this.scale - _this.origin.x;
	        mouse.y = (event.clientY + document.body.scrollTop + document.documentElement.scrollTop - elm.offsetTop) / _this.scale - _this.origin.y;
	        mouse.justClicked = false;
	    }, false);
	
	    elm.addEventListener('mousedown', function (event) {
	        mouse.down = true;
	        mouse.justClicked = true;
	    }, false);
	
	    elm.addEventListener('mouseup', function (event) {
	        mouse.down = false;
	        mouse.lockOn = null;
	        mouse.justClicked = false;
	    }, false);
	
	    elm.addEventListener('mouseout', function (event) {
	        mouse.down = false;
	        mouse.lockOn = null;
	        mouse.justClicked = false;
	    }, false);
	
	    return mouse;
	}
	
	/**
	 * 拖拽
	 * *** 解决鼠标各种点击情况
	 * - 点击空白然后移入
	 * - 点中然后速度过快移出
	 * - 移出区域
	 * @param  {Base}  监控的元素
	 * @param  {Fun}   拖拽发生时进行的操作
	 * @param  {Bool}  点击过程中是否禁止物体移动
	 */
	function __draftBase(mouse, entity, move, ifCatch) {
	    ifCatch = ifCatch && true;
	    var ifIn = ifPointIn(mouse, entity.getBounds());
	    if (ifIn && mouse.down && mouse.justClicked) {
	        mouse.lockOn = entity;
	        entity.__catched = ifCatch;
	    }
	    if (mouse.down && mouse.lockOn === entity) {
	        move(entity);
	    } else {
	        entity.__catched = false;
	    }
	}
	
	/**
	 * 简单拖拽, 直接改变被拖拽物体的坐标
	 * @method draftSimple
	 * @param  {Base}  监控的实体
	 */
	function draftSimple(entity) {
	    var _this2 = this;
	
	    __draftBase(this.mouse, entity, function (entity) {
	        entity.x = _this2.mouse.x;
	        entity.y = _this2.mouse.y;
	        entity.vx = _this2.mouse.x - entity.x;
	        entity.vy = _this2.mouse.y - entity.y;
	    }, true);
	}
	
	/**
	 * 缓动拖拽(牵拉), 直接改变被拖拽物体的速度
	 * @method draftEase
	 * @param  {Base}  被监控实体
	 * @param  {Float} 缓动系数
	 */
	function draftEase(entity, easing) {
	    var _this3 = this;
	
	    __draftBase(this.mouse, entity, function (entity) {
	        entity.vx = (_this3.mouse.x - entity.x) * easing;
	        entity.vy = (_this3.mouse.y - entity.y) * easing;
	        // 辅助线降频
	        if (_this3.ctHelperAvailable) {
	            _this3.ct.save();
	            _this3.ct.beginPath();
	            _this3.ct.strokeStyle = 'red';
	            _this3.ct.lineWidth = 1;
	            _this3.ct.moveTo(entity.x, entity.y);
	            _this3.ct.lineTo(_this3.mouse.x, _this3.mouse.y);
	            _this3.ct.stroke();
	            _this3.ct.restore();
	        }
	    }, false);
	}
	
	/**
	 * 弹弓模型(反向拉橡皮筋)
	 * @method bungee
	 * @param  {Base} 被监控的实体
	 * @param  {Float} 弹性系数
	 * @param  {Float} 橡皮筋长度极限, 超过这个极限则不满足胡克定律
	 */
	function draftBungee(entity, elastane, edge) {
	    var _this4 = this;
	
	    __draftBase(this.mouse, entity, function (entity) {
	        // 运动中的物体进制上弹簧
	        if (entity.vx < 0.5 && entity.vy < 0.5 && entity.ay < 0.5 && entity.ay < 0.5 || entity.__catched) {
	            // 绘制弹簧和瞄准线
	            // 辅助线降频
	            if (_this4.ctHelperAvailable) {
	                _this4.ct.save();
	                _this4.ct.beginPath();
	                _this4.ct.strokeStyle = '#0091EA';
	                _this4.ct.lineWidth = 2;
	                _this4.ct.moveTo(entity.x, entity.y);
	                _this4.ct.lineTo(_this4.mouse.x, _this4.mouse.y);
	                _this4.ct.stroke();
	                _this4.ct.beginPath();
	                _this4.ct.moveTo(entity.x, entity.y);
	                _this4.ct.setLineDash([4, 4]); // 线段长, 空隙长
	                _this4.ct.lineDashOffset = 0; // 起始位置偏移量
	                _this4.ct.strokeStyle = '#2979FF';
	                _this4.ct.lineWidth = 1;
	                _this4.ct.lineTo(entity.x - (_this4.mouse.x - entity.x) * 3, entity.y - (_this4.mouse.y - entity.y) * 3);
	                _this4.ct.stroke();
	                _this4.ct.restore();
	            }
	            var len = _this4.getDistance(entity, _this4.mouse);
	            if (len > edge) {
	                elastane = elastane / (len / edge);
	            }
	            entity.vx = (entity.x - _this4.mouse.x) * elastane * 0.1;
	            entity.vy = (entity.y - _this4.mouse.y) * elastane * 0.1;
	        }
	    }, true);
	}
	
	/**
	 * 滚轮缩放
	 */
	function wheel() {
	    var _this5 = this;
	
	    this.canvas.addEventListener('wheel', function (event) {
	        if (event.deltaY < 0) {
	            _this5.scale *= 1.1;
	            _this5.origin.x -= _this5.mouse.x * 0.1 / _this5.scale;
	            _this5.origin.y -= _this5.mouse.y * 0.1 / _this5.scale;
	        }
	        if (event.deltaY > 0) {
	            _this5.scale *= 0.9;
	            _this5.origin.x += _this5.mouse.x * 0.1 / _this5.scale;
	            _this5.origin.y += _this5.mouse.y * 0.1 / _this5.scale;
	        }
	    });
	}
	
	/**
	 * 方向键
	 */
	function directionKey() {
	    var _this6 = this;
	
	    // 方向键的监听无法绑到元素上
	    document.addEventListener('keydown', function (event) {
	        switch (event.key) {
	            case "ArrowDown":
	                _this6.origin.y -= 30 / _this6.scale;
	                break;
	            case "ArrowUp":
	                _this6.origin.y += 30 / _this6.scale;
	                break;
	            case "ArrowLeft":
	                _this6.origin.x += 30 / _this6.scale;
	                break;
	            case "ArrowRight":
	                _this6.origin.x -= 30 / _this6.scale;
	                break;
	            default:
	                return; // Quit when this doesn't handle the key event.
	        }
	    });
	}
	
	function zoomAndPan() {
	    wheel.bind(this)();
	    directionKey.bind(this)();
	}
	
	exports.ifPointIn = ifPointIn;
	exports.getCursor = getCursor;
	exports.draftSimple = draftSimple;
	exports.draftEase = draftEase;
	exports.draftBungee = draftBungee;
	exports.zoomAndPan = zoomAndPan;

/***/ },
/* 26 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * 遍历关系
	 */
	
	/**
	 * 两组实体之间的关系(实体组内部无关系)
	 * 链式调用: between([arrayOfBase, Base], [Base]).when((A, B)=>{if...}).do((A, B)=>{do...})
	 * @method between
	 * @param  {Array(Array|Base)} setsA
	 * @param  {Array(Array|Base)} setsB
	 */
	function between(setsA, setsB) {
	    var entitiesA = setsA.reduce(function (a, b) {
	        return a.concat(b);
	    }, []);
	    var entitiesB = setsB.reduce(function (a, b) {
	        return a.concat(b);
	    }, []);
	    return {
	        do: function _do(funcDo) {
	            _travBetween(entitiesA, entitiesB, funcDo);
	        },
	        when: function when(funcWhen) {
	            return {
	                do: function _do(funcDo) {
	                    _travBetween(entitiesA, entitiesB, function (A, B) {
	                        if (funcWhen(A, B)) {
	                            funcDo(A, B);
	                        }
	                    });
	                }
	            };
	        }
	    };
	}
	/**
	 * 实体之间的关系
	 * @method among
	 * @param  {Array(Base)|Base} ...sets
	 */
	function among() {
	    for (var _len = arguments.length, sets = Array(_len), _key = 0; _key < _len; _key++) {
	        sets[_key] = arguments[_key];
	    }
	
	    var entities = sets.reduce(function (a, b) {
	        return a.concat(b);
	    });
	    return {
	        do: function _do(funcDo) {
	            _travAmong(entities, funcDo);
	        },
	        when: function when(funcWhen) {
	            return {
	                do: function _do(funcDo) {
	                    _travAmong(entities, function (A, B) {
	                        if (funcWhen(A, B)) {
	                            funcDo(A, B);
	                        }
	                    });
	                }
	            };
	        }
	    };
	}
	
	function _travBetween(entitiesA, entitiesB, func) {
	    for (var i = 0; i < entitiesA.length; i++) {
	        var entity = entitiesA[i];
	        for (var j = 0; j < entitiesB.length; j++) {
	            var nextEntity = entitiesB[j];
	            func(entity, nextEntity);
	        }
	    }
	}
	
	function _travAmong(entities, func) {
	    for (var i = 0; i < entities.length - 1; i++) {
	        var entity = entities[i];
	        for (var j = i + 1; j < entities.length; j++) {
	            var nextEntity = entities[j];
	            func(entity, nextEntity);
	        }
	    }
	}
	
	exports.between = between;
	exports.among = among;

/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * 圆形与碰撞边界相碰
	 * - A和B之间一个为arc一个为bound
	 * @method __elasticImpactArcBound
	 * @param  {[type]}                A [description]
	 * @param  {[type]}                B [description]
	 * @return {[type]}                  [description]
	 */
	function useElasticCollision(A, B) {
	    var ball = void 0,
	        zone = void 0,
	        restitution = void 0;
	    var boundA = A.getBounds();
	    var boundB = B.getBounds();
	    if (boundA.type === 'arc') {
	        ball = A;
	        zone = boundB.zone;
	        restitution = boundB.restitution;
	    } else {
	        ball = B;
	        zone = boundA.zone;
	        restitution = boundA.restitution;
	    }
	    if (ball.x + ball.radius >= zone[2]) {
	        ball.vx = -ball.vx * restitution;
	        ball.ax = -ball.ax;
	        ball.x = zone[2] - ball.radius; // 立刻退回区域内, 暂时不按原路径退回
	    }
	    if (ball.x - ball.radius <= zone[0]) {
	        ball.vx = -ball.vx * restitution;
	        ball.ax = -ball.ax;
	        ball.x = zone[0] + ball.radius; // 立刻退回区域内, 暂时不按原路径退回
	    }
	    if (ball.y + ball.radius >= zone[3]) {
	        ball.vy = -ball.vy * restitution;
	        ball.ay = -ball.ay;
	        ball.y = zone[3] - ball.radius; // 立刻退回区域内, 暂时不按原路径退回
	    }
	    if (ball.y - ball.radius <= zone[1]) {
	        ball.vy = -ball.vy * restitution;
	        ball.ay = -ball.ay;
	        ball.y = zone[1] + ball.radius; // 立刻退回区域内, 暂时不按原路径退回
	    }
	}
	
	exports.useElasticCollision = useElasticCollision;

/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * 两个Circle之间的碰撞检测
	 * @method ifCollide
	 * @param  {Bounds}  objBounds0 A物体的边界
	 * @param  {Bounds}  objBounds1 B物体的边界
	 * @return {Bool}
	 */
	function ifCollide(A, B) {
	    // 针对圆形的碰撞检测
	    var boundsA = A.getBounds();
	    var boundsB = B.getBounds();
	    var colli = Math.sqrt(Math.pow(boundsA.x - boundsB.x, 2) + Math.pow(boundsA.y - boundsB.y, 2)) <= boundsA.radius + boundsB.radius;
	    // 画出碰撞辅助线
	    if (this.ctHelperAvailable && colli) {
	        this.ct.save();
	        this.ct.beginPath();
	        this.ct.moveTo(A.x, A.y);
	        this.ct.strokeStyle = 'green';
	        this.ct.lineWidth = 1;
	        this.ct.lineTo(B.x, B.y);
	        this.ct.stroke();
	        this.ct.restore();
	    }
	    return colli;
	}
	
	/**
	 * Circle相交回退
	 * 若A和B相交, 则直接调整两者位置, 以退回相切的位置
	 * @method noCross
	 */
	function noCross(A, B) {
	    var distance = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
	    // 针对圆形的位置调整
	    if (A.radius + B.radius > distance) {
	        // 重合了
	        // 辅助线降频
	        if (this.ctHelperAvailable) {
	            this.ct.save();
	            this.ct.beginPath();
	            this.ct.moveTo(A.x, A.y);
	            this.ct.strokeStyle = 'yellow';
	            this.ct.lineWidth = 1;
	            this.ct.lineTo(B.x, B.y);
	            this.ct.stroke();
	            this.ct.restore();
	        }
	
	        var central = {
	            x: (A.x * A.radius + B.x * B.radius) / (A.radius + B.radius),
	            y: (A.y * A.radius + B.y * B.radius) / (A.radius + B.radius)
	        };
	        // 需要移动的距离, 先不考虑两个球移动的距离应该不同
	        var d = (A.radius + B.radius - distance) / 2;
	        // 夹角
	        var beta = Math.atan2(B.y - A.y, B.x - A.x);
	        var dx = Math.cos(beta) * d;
	        var dy = Math.sin(beta) * d;
	        A.x -= dx * 1.05;
	        A.y -= dy * 1.05;
	        B.x += dx * 1.05;
	        B.y += dy * 1.05;
	    }
	}
	
	/**
	 * Circle弹性碰撞
	 * @method elasticImpactArcArc
	 * @param  {[type]}              A [description]
	 * @param  {[type]}              B [description]
	 */
	function elasticCollision(A, B) {
	    // ** 连线方向正碰
	    // 连线方向矢量
	    var X = [B.x - A.x, B.y - A.y];
	    var lenX = Math.sqrt(Math.pow(X[0], 2) + Math.pow(X[1], 2)); // 连线向量长度
	    // 连线方向上的速度
	    var vAX = (A.vx * X[0] + 0 * X[1]) / lenX + (0 * X[0] + A.vy * X[1]) / lenX;
	    var vBX = (B.vx * X[0] + 0 * X[1]) / lenX + (0 * X[0] + B.vy * X[1]) / lenX;
	    var vAXN = ((A.m - B.m) * vAX + 2 * B.m * vBX) / (A.m + B.m);
	    var vBXN = (2 * A.m * vAX + (B.m - A.m) * vBX) / (A.m + B.m);
	    // ** 切面方向v不变
	    // 切线方向矢量
	    var Y = [1, -X[0] / X[1]]; // 随便设一个, 垂直就好
	    // ---- 这里有个坑: 切线可能垂直(lenY = Infinity)
	    var lenY = Math.sqrt(Math.pow(Y[0], 2) + Math.pow(Y[1], 2)); // 切线向量长度
	    if (lenY > 99999999) {
	        lenY = 1;
	        Y = [0, 1];
	    };
	    // 切线方向上的速度
	    var vAY = (A.vx * Y[0] + 0 * Y[1]) / lenY + (0 * Y[0] + A.vy * Y[1]) / lenY;
	    var vBY = (B.vx * Y[0] + 0 * Y[1]) / lenY + (0 * Y[0] + B.vy * Y[1]) / lenY;
	    // ** 合成新速度
	    // 连线方向上的新速度是标量, 方向与X相同, 现在映射到x, y上
	    var oX = Math.atan2(X[1], X[0]); // 连线与x轴的夹角
	    var oY = Math.atan2(Y[1], Y[0]); // 切线与x轴的夹角
	    var mapxA = vAXN * Math.cos(oX) + vAY * Math.cos(oY);
	    var mapyA = vAXN * Math.sin(oX) + vAY * Math.sin(oY); // 正负问题?
	    var mapxB = vBXN * Math.cos(oX) + vBY * Math.cos(oY);
	    var mapyB = vBXN * Math.sin(oX) + vBY * Math.sin(oY); // 正负问题?
	
	    if (isNaN(mapxA + mapyA + mapxB + mapyB)) {
	        throw new Error('速度合成结果有问题');
	    }
	
	    A.vx = isNaN(mapxA) ? 0 : mapxA;
	    A.vy = isNaN(mapyA) ? 0 : mapyA;
	    B.vx = isNaN(mapxB) ? 0 : mapxB;
	    B.vy = isNaN(mapyB) ? 0 : mapyB;
	}
	
	/**
	 * 综合弹性碰撞
	 * - 碰撞检测
	 * - 相交回退
	 * - 碰撞模型计算
	 * @method useElasticCollision
	 * @param  {[type]}            A [description]
	 * @param  {[type]}            B [description]
	 */
	function useElasticCollision(A, B, callback) {
	    if (ifCollide(A, B)) {
	        noCross(A, B);
	        elasticCollision(A, B);
	        callback(A, B);
	    }
	}
	
	/**
	 * Circle完全非弹性碰撞模型
	 * Perfectly inelastic collision
	 * @method pICollision
	 * @param  {Base}      A
	 * @param  {Base}      B
	 */
	function pICollision(A, B) {
	    var main = void 0,
	        sub = void 0;
	    if (A.m >= B.m) {
	        main = A;
	        sub = B;
	    } else {
	        main = B;
	        sub = A;
	    }
	    var newM = A.m + B.m; // 合成物体的质量
	    newM = newM || 0.0001; // 避免质量为零下面出现NaN
	    var newVx = (A.vx * A.m + B.vx * B.m) / newM;
	    var newVy = (A.vy * A.m + B.vy * B.m) / newM;
	
	    main.vx = newVx;
	    main.vy = newVy;
	    sub.destory();
	}
	
	/**
	 * Circle融合
	 * @method sizeMerge
	 * @param  {[type]}  A [description]
	 * @param  {[type]}  B [description]
	 */
	function sizeMerge(A, B) {
	    var main = void 0,
	        sub = void 0;
	    if (A.m >= B.m) {
	        main = A;sub = B;
	    } else {
	        main = B;sub = A;
	    }
	
	    if (main.getBounds().type === 'arc' && sub.getBounds().type === 'arc') {
	        main.radius = Math.sqrt(Math.pow(main.radius, 2) + Math.pow(sub.radius, 2));
	        sub.radius = 0;
	        main.m += sub.m;
	        sub.m = 0;
	        main.x += (sub.x - main.x) * sub.radius / (sub.radius + main.radius);
	        main.y += (sub.y - main.y) * sub.radius / (sub.radius + main.radius);
	    }
	}
	
	/**
	 * 综合完全非弹性碰撞
	 * - 碰撞检测
	 * - 完全非弹性模型
	 * - 尺寸合并
	 * @method usePICollision
	 * @param  {[type]}       A        [description]
	 * @param  {[type]}       B        [description]
	 * @param  {Function}     callback [description]
	 */
	function usePICollision(A, B, callback) {
	    if (ifCollide(A, B)) {
	        pICollision(A, B);
	        sizeMerge(A, B);
	    }
	}
	
	exports.ifCollide = ifCollide;
	exports.noCross = noCross;
	exports.elasticCollision = elasticCollision;
	exports.pICollision = pICollision;
	exports.sizeMerge = sizeMerge;
	exports.useElasticCollision = useElasticCollision;
	exports.usePICollision = usePICollision;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.userPICollision = exports.useElasticCollision = undefined;
	
	var _circleCircle = __webpack_require__(28);
	
	var circleCircle = _interopRequireWildcard(_circleCircle);
	
	var _circleBox = __webpack_require__(27);
	
	var circleBox = _interopRequireWildcard(_circleBox);
	
	var _polygonPolygon = __webpack_require__(30);
	
	var polygonPolygon = _interopRequireWildcard(_polygonPolygon);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	/**
	 * 弹性碰撞模型
	 * 符合动量守恒/动能守恒的任意角度弹性碰撞模型
	 * - 副作用: 直接修改传入实体的vx,vy属性
	 * @method elasticImpact
	 * @param  {Base}      A
	 * @param  {Base}      B
	 */
	function useElasticCollision(A, B) {
	    var typeA = A.getBounds().type;
	    var typeB = B.getBounds().type;
	    if (typeA === 'arc' && typeB === 'arc') {
	        circleCircle.useElasticCollision.bind(this)(A, B);
	    } else if (typeA === 'arc' && typeB === 'box' || typeA === 'box' && typeB === 'arc') {
	        circleBox.useElasticCollision.bind(this)(A, B);
	    } else if (typeA === 'polygon' && typeB === 'polygon') {
	        polygonPolygon.useElasticCollision.bind(this)(A, B);
	    }
	}
	
	/**
	 * 非弹性碰撞
	 */
	
	/**
	 * 根据两个物体的shape来选择碰撞模型
	 */
	
	function userPICollision(A, B) {
	    var typeA = A.getBounds().type;
	    var typeB = B.getBounds().type;
	    if (typeA === 'arc' && typeB === 'arc') {
	        circleCircle.userPICollision.bind(this)(A, B);
	    }
	}
	
	exports.useElasticCollision = useElasticCollision;
	exports.userPICollision = userPICollision;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.useElasticCollision = undefined;
	
	var _math = __webpack_require__(1);
	
	var _GJK = __webpack_require__(7);
	
	var _GJK2 = _interopRequireDefault(_GJK);
	
	var _EPA = __webpack_require__(6);
	
	var _EPA2 = _interopRequireDefault(_EPA);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// 碰撞反馈,
	// 麻烦的地方是碰撞冲量怎么计算
	function contactHandler(contact) {
	    var Avx = contact.shapeA.vx; // A 速度分量
	    var Avy = contact.shapeA.vy; // A 速度分量
	    var Bvx = contact.shapeB.vx; // B 速度分量
	    var Bvy = contact.shapeB.vy; // B 速度分量
	    var Aav = contact.shapeA.angularVelocity; // A角速度
	    var Bav = contact.shapeB.angularVelocity; // B角速度
	    var n = contact.normal; // 碰撞(分离)向量(单位向量)(B指向A)
	    // let depth = contact.depth; // 碰撞深度(最短分离深度)
	    // 点碰边, 则以碰撞点作为两个物体的碰撞位置
	    if (contact.featureA.type === 'point' || contact.featureB.type === 'point') {
	        // 注意: 不存在点碰点
	        // 计算碰撞冲量的大小
	        var A = contact.shapeA;
	        var B = contact.shapeB;
	        var vA1 = new _math.Vec2(A.vx, A.vy);
	        var vB1 = new _math.Vec2(B.vx, B.vy);
	        // 碰撞点
	        var P = contact.featureA.type === 'point' ? contact.featureA.point : contact.featureB.point;
	        // 恢复系数
	        var e = 0.8;
	        // 质量
	        var mA = contact.shapeA.m;
	        var mB = contact.shapeB.m;
	        // r
	        var rAP = P.sub(A.centroid);
	        var rBP = P.sub(B.centroid);
	        // 两个物体在碰撞点处的速度: vP = vO + ω*rOP⊥
	        var vAP = vA1.add(rAP.getPerp().mult(A.angularVelocity)); // 获取的垂线和角速度正方向都是顺时针的(因为y轴向下)
	        var vBP = vB1.add(rBP.getPerp().mult(B.angularVelocity)); // 获取的垂线和角速度正方向都是顺时针的(因为y轴向下)
	        var vAB = vAP.sub(vBP);
	        // 分子
	        var jUP = -(1 + e) * vAB.dot(n);
	        // 分母
	        var jDOWN = n.dot(n) * (1 / mA + 1 / mB) + Math.pow(rAP.perpDot(n), 2) / A.I + Math.pow(rBP.perpDot(n), 2) / B.I;
	        // 冲量系数
	        var j = jUP / jDOWN;
	        // 冲量
	        var pA = n.mult(j).getOpp();
	        var pB = n.mult(j);
	        // 改变速度和角速度
	        var vA2 = vA1.add(pA.mult(1 / mA));
	        var vB2 = vB1.add(pB.mult(1 / mB));
	        A.vx = vA2.x;
	        A.vy = vA2.y;
	        B.vx = vB2.x;
	        B.vy = vB2.y;
	        var deltaOmigaA = rAP.perpDot(pA) / A.I;
	        var deltaOmigaB = rBP.perpDot(pB) / B.I;
	        A.angularVelocity += deltaOmigaA;
	        B.angularVelocity += deltaOmigaB;
	        console.log('#253, done');
	    }
	}
	
	function impulse(poly, point, I) {}
	
	function useElasticCollision(A, B) {
	    var contact = _GJK2.default.bind(this)(A, B);
	    if (contact) {
	        contact.draw(this.ct);
	        contactHandler(contact);
	    }
	    // contact && contact.draw(this.ct);
	    // console.log(contact);
	}
	
	exports.useElasticCollision = useElasticCollision;
	exports.default = useElasticCollision;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.uGrav = undefined;
	
	var _math = __webpack_require__(1);
	
	function uGrav(A, B, G) {
	    var r = (0, _math.getDistance)(A, B);
	    r = r === 0 ? 0.01 : r;
	    // console.log(r);
	    if (!r) {
	        console.log(r);
	        error;
	    }
	    // 对A
	    var unitVectorA = {
	        x: (B.x - A.x) / r,
	        y: (B.y - A.y) / r
	    };
	    var Fabx = G * A.m * B.m / Math.pow(r, 2) * unitVectorA.x;
	    var Faby = G * A.m * B.m / Math.pow(r, 2) * unitVectorA.y;
	    A.ax += Fabx / A.m;
	    A.ay += Faby / A.m;
	    // 对B
	    var unitVectorB = {
	        x: -unitVectorA.x,
	        y: -unitVectorA.y
	    };
	    var Fbax = G * A.m * B.m / Math.pow(r, 2) * unitVectorB.x;
	    var Fbay = G * A.m * B.m / Math.pow(r, 2) * unitVectorB.y;
	    B.ax += Fbax / B.m;
	    B.ay += Fbay / B.m;
	
	    if (this.ctHelperAvailable) {
	        this.ct.save();
	        this.ct.strokeStyle = 'red';
	        this.ct.lineWidth = 0.05 + 100 / r;
	        this.ct.beginPath();
	        this.ct.moveTo(A.x, A.y);
	        this.ct.lineTo(B.x, B.y);
	        this.ct.stroke();
	        this.ct.restore();
	    }
	} /**
	   * 万有引力定律
	   * @method uGrav
	   * @param  {[type]} A 物体
	   * @param  {[type]} B 物体
	   * @param  {[type]} G 万有引力常数, 需要自行校准
	   */
	
	exports.uGrav = uGrav;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.spring = undefined;
	
	var _math = __webpack_require__(1);
	
	function spring(A, B, fixDis) {
	    var dis = (0, _math.getDistance)(A, B);
	    var offset = dis - fixDis;
	    var theta = Math.atan2(B.y - A.y, B.x - A.x);
	    var beta = Math.atan2(A.y - B.y, A.x - B.x);
	    A.ax += Math.cos(theta) * offset / 15;
	    A.ay += Math.sin(theta) * offset / 15;
	    B.ax += Math.cos(beta) * offset / 15;
	    B.ay += Math.sin(beta) * offset / 15;
	
	    if (this.ctHelperAvailable) {
	        this.ct.save();
	        this.ct.moveTo(A.x, A.y);
	        this.ct.lineTo(B.x, B.y);
	        this.ct.strokeStyle = 'white';
	        this.ct.stroke();
	        this.ct.restore();
	    }
	}
	
	exports.spring = spring;

/***/ }
/******/ ]);
//# sourceMappingURL=Engine.js.map