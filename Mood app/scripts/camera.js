(function (global) {
     var app = global.app = global.app || {};

    var CameraViewModel = kendo.data.ObservableObject.extend({
        _lastImageData: null,
        moodsDataSource: null,

        init: function () {
            var that = this,
                dataSource;

            kendo.data.ObservableObject.fn.init.apply(that, []);

            var el = new Everlive("xYopwdrrAJVDuvtf");

            dataSource = new kendo.data.DataSource({
                type: "everlive",
                transport: {
                    typeName: "Moods"
                },
                schema: {
                    model: {
                        id: Everlive.idField,
                        fields: {
                            Comment: {
                                field: "Comment",
                                defaultValue: ""
                            },
                             Mood: {
                                field: "Mood",
                                defaultValue: ""
                            },
                            Picture: {
                                field: "Picture",
                                defaultValue: ""
                            }
                        },
                        CreatedDate: function () {
                            return kendo.toString(this.CreatedAt, "D");
                        }
                    }
                }
            });

            that.set("moodsDataSource", dataSource);
        },
        
        onC: function(){
            
        },
        startCamera: function (){
            var that = this;
            
            navigator.camera.getPicture(
                function (imageData){
                    
                        var image = document.getElementById('previewImage');
                        image.src = "data:image/jpeg;base64," + imageData;
                    	that._lastImageData = imageData;
                    
        		}, 
                function(message){
        				
    			}, 
                { quality: 10,
                destinationType: Camera.DestinationType.DATA_URL
             }); 
        },
        onUpload: function(){
            app.application.changeLoadingMessage("<h2>Uploading...</h2>");
            app.application.showLoading();
            var that = this;
 			var mood = null;
            
            if($('#moodButton').data("kendoMobileButtonGroup").current().index() === 0)
            {
            	mood = "Happy";
            }
            else
            {
                mood = "Sad";
            }
            
            var file = {
                "Filename": "mood.png",
                "ContentType": "image/png",
                "base64": that._lastImageData
            };
            
            var el = new Everlive("xYopwdrrAJVDuvtf");
            
            el.Files.create(file,
                    function (data) {
                        
						var newMood = that.moodsDataSource.add();
                        newMood.Comment = $('#photoComment').val();
                        newMood.Mood = mood;
                        newMood.Picture = data.result.Id;
            			
                        that.moodsDataSource.one('sync', function () {  
                            app.application.hideLoading();
                            app.application.navigate('#gallery-view');                         
                        });                        
            			
                        that.moodsDataSource.sync();
                    },
                    function (error) {
                        alert(JSON.stringify(error));
                    });
                }
    });

    app.cameraService = {
        
        viewModel: new CameraViewModel(),
        show: function()
        {
            app.cameraService.viewModel.startCamera.apply(app.cameraService.viewModel, []);
            $('#newEvent').val('');
        }
    };
}
)(window);