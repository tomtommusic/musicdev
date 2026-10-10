import sys
script = r'''set -e
SRC="${PROJECT_DIR}/.."
DST="${TARGET_BUILD_DIR}/${UNLOCALIZED_RESOURCES_FOLDER_PATH}/web"
rm -rf "$DST"
mkdir -p "$DST"
cp "$SRC/index.html" "$SRC/abcjs-basic-min.js" "$SRC/manifest.webmanifest" "$DST/"
cp -R "$SRC/fonts" "$SRC/icons" "$DST/"
echo "App web copiee dans $DST"
'''
esc = script.replace('\\','\\\\').replace('"','\\"').replace('\n','\\n')
common_debug = '''
				ALWAYS_SEARCH_USER_PATHS = NO;
				CLANG_ENABLE_MODULES = YES;
				ENABLE_USER_SCRIPT_SANDBOXING = NO;
				IPHONEOS_DEPLOYMENT_TARGET = 15.0;
				SDKROOT = iphoneos;
				SWIFT_VERSION = 5.0;'''
target_settings = '''
				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
				CODE_SIGN_STYLE = Automatic;
				CURRENT_PROJECT_VERSION = 1;
				DEVELOPMENT_TEAM = "";
				ENABLE_USER_SCRIPT_SANDBOXING = NO;
				GENERATE_INFOPLIST_FILE = NO;
				INFOPLIST_FILE = MusicDEV/Info.plist;
				IPHONEOS_DEPLOYMENT_TARGET = 15.0;
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/Frameworks",
				);
				MARKETING_VERSION = 1.4;
				PRODUCT_BUNDLE_IDENTIFIER = ca.tomtommusic.musicdev;
				PRODUCT_NAME = MusicDEV;
				SWIFT_VERSION = 5.0;
				TARGETED_DEVICE_FAMILY = "1,2";'''
pbx = f'''// !$*UTF8*$!
{{
	archiveVersion = 1;
	classes = {{
	}};
	objectVersion = 56;
	objects = {{

/* Begin PBXBuildFile section */
		A1000000000000000000B001 /* App.swift in Sources */ = {{isa = PBXBuildFile; fileRef = A1000000000000000000F001 /* App.swift */; }};
		A1000000000000000000B002 /* Assets.xcassets in Resources */ = {{isa = PBXBuildFile; fileRef = A1000000000000000000F002 /* Assets.xcassets */; }};
/* End PBXBuildFile section */

/* Begin PBXFileReference section */
		A1000000000000000000F000 /* MusicDEV.app */ = {{isa = PBXFileReference; explicitFileType = wrapper.application; includeInIndex = 0; path = MusicDEV.app; sourceTree = BUILT_PRODUCTS_DIR; }};
		A1000000000000000000F001 /* App.swift */ = {{isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = App.swift; sourceTree = "<group>"; }};
		A1000000000000000000F002 /* Assets.xcassets */ = {{isa = PBXFileReference; lastKnownFileType = folder.assetcatalog; path = Assets.xcassets; sourceTree = "<group>"; }};
		A1000000000000000000F003 /* Info.plist */ = {{isa = PBXFileReference; lastKnownFileType = text.plist.xml; path = Info.plist; sourceTree = "<group>"; }};
/* End PBXFileReference section */

/* Begin PBXFrameworksBuildPhase section */
		A1000000000000000000P003 /* Frameworks */ = {{
			isa = PBXFrameworksBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			runOnlyForDeploymentPostprocessing = 0;
		}};
/* End PBXFrameworksBuildPhase section */

/* Begin PBXGroup section */
		A1000000000000000000G000 = {{
			isa = PBXGroup;
			children = (
				A1000000000000000000G001 /* MusicDEV */,
				A1000000000000000000G002 /* Products */,
			);
			sourceTree = "<group>";
		}};
		A1000000000000000000G001 /* MusicDEV */ = {{
			isa = PBXGroup;
			children = (
				A1000000000000000000F001 /* App.swift */,
				A1000000000000000000F002 /* Assets.xcassets */,
				A1000000000000000000F003 /* Info.plist */,
			);
			path = MusicDEV;
			sourceTree = "<group>";
		}};
		A1000000000000000000G002 /* Products */ = {{
			isa = PBXGroup;
			children = (
				A1000000000000000000F000 /* MusicDEV.app */,
			);
			name = Products;
			sourceTree = "<group>";
		}};
/* End PBXGroup section */

/* Begin PBXNativeTarget section */
		A1000000000000000000T001 /* MusicDEV */ = {{
			isa = PBXNativeTarget;
			buildConfigurationList = A1000000000000000000L002 /* Build configuration list for PBXNativeTarget "MusicDEV" */;
			buildPhases = (
				A1000000000000000000P001 /* Sources */,
				A1000000000000000000P003 /* Frameworks */,
				A1000000000000000000P002 /* Resources */,
				A1000000000000000000P004 /* Copier l'app web */,
			);
			buildRules = (
			);
			dependencies = (
			);
			name = MusicDEV;
			productName = MusicDEV;
			productReference = A1000000000000000000F000 /* MusicDEV.app */;
			productType = "com.apple.product-type.application";
		}};
/* End PBXNativeTarget section */

/* Begin PBXProject section */
		A1000000000000000000R000 /* Project object */ = {{
			isa = PBXProject;
			attributes = {{
				BuildIndependentTargetsInParallel = 1;
				LastSwiftUpdateCheck = 1500;
				LastUpgradeCheck = 1500;
				TargetAttributes = {{
					A1000000000000000000T001 = {{
						CreatedOnToolsVersion = 15.0;
					}};
				}};
			}};
			buildConfigurationList = A1000000000000000000L001 /* Build configuration list for PBXProject "MusicDEV" */;
			compatibilityVersion = "Xcode 14.0";
			developmentRegion = fr;
			hasScannedForEncodings = 0;
			knownRegions = (
				en,
				fr,
				Base,
			);
			mainGroup = A1000000000000000000G000;
			productRefGroup = A1000000000000000000G002 /* Products */;
			projectDirPath = "";
			projectRoot = "";
			targets = (
				A1000000000000000000T001 /* MusicDEV */,
			);
		}};
/* End PBXProject section */

/* Begin PBXResourcesBuildPhase section */
		A1000000000000000000P002 /* Resources */ = {{
			isa = PBXResourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
				A1000000000000000000B002 /* Assets.xcassets in Resources */,
			);
			runOnlyForDeploymentPostprocessing = 0;
		}};
/* End PBXResourcesBuildPhase section */

/* Begin PBXShellScriptBuildPhase section */
		A1000000000000000000P004 /* Copier l'app web */ = {{
			isa = PBXShellScriptBuildPhase;
			alwaysOutOfDate = 1;
			buildActionMask = 2147483647;
			files = (
			);
			inputFileListPaths = (
			);
			inputPaths = (
			);
			name = "Copier l'app web";
			outputFileListPaths = (
			);
			outputPaths = (
			);
			runOnlyForDeploymentPostprocessing = 0;
			shellPath = /bin/sh;
			shellScript = "{esc}";
		}};
/* End PBXShellScriptBuildPhase section */

/* Begin PBXSourcesBuildPhase section */
		A1000000000000000000P001 /* Sources */ = {{
			isa = PBXSourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
				A1000000000000000000B001 /* App.swift in Sources */,
			);
			runOnlyForDeploymentPostprocessing = 0;
		}};
/* End PBXSourcesBuildPhase section */

/* Begin XCBuildConfiguration section */
		A1000000000000000000C001 /* Debug */ = {{
			isa = XCBuildConfiguration;
			buildSettings = {{{common_debug}
				DEBUG_INFORMATION_FORMAT = dwarf;
				ENABLE_TESTABILITY = YES;
				GCC_OPTIMIZATION_LEVEL = 0;
				ONLY_ACTIVE_ARCH = YES;
				SWIFT_ACTIVE_COMPILATION_CONDITIONS = DEBUG;
				SWIFT_OPTIMIZATION_LEVEL = "-Onone";
			}};
			name = Debug;
		}};
		A1000000000000000000C002 /* Release */ = {{
			isa = XCBuildConfiguration;
			buildSettings = {{{common_debug}
				DEBUG_INFORMATION_FORMAT = "dwarf-with-dsym";
				SWIFT_COMPILATION_MODE = wholemodule;
				VALIDATE_PRODUCT = YES;
			}};
			name = Release;
		}};
		A1000000000000000000C003 /* Debug */ = {{
			isa = XCBuildConfiguration;
			buildSettings = {{{target_settings}
			}};
			name = Debug;
		}};
		A1000000000000000000C004 /* Release */ = {{
			isa = XCBuildConfiguration;
			buildSettings = {{{target_settings}
			}};
			name = Release;
		}};
/* End XCBuildConfiguration section */

/* Begin XCConfigurationList section */
		A1000000000000000000L001 /* Build configuration list for PBXProject "MusicDEV" */ = {{
			isa = XCConfigurationList;
			buildConfigurations = (
				A1000000000000000000C001 /* Debug */,
				A1000000000000000000C002 /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		}};
		A1000000000000000000L002 /* Build configuration list for PBXNativeTarget "MusicDEV" */ = {{
			isa = XCConfigurationList;
			buildConfigurations = (
				A1000000000000000000C003 /* Debug */,
				A1000000000000000000C004 /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		}};
/* End XCConfigurationList section */
	}};
	rootObject = A1000000000000000000R000 /* Project object */;
}}
'''
open(sys.argv[1],'w').write(pbx)
