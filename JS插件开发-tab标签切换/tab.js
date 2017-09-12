;(function($){
    var Tab = function(tab){
        var _this_ = this;
        //保存单个tab组件
        this.tab = tab;
        console.log(this.tab);
        //默认配置参数
        this.config = {
            //用来定义鼠标的触发类型，是click还是mouseover
            "triggerType":"mouseover",
            //用来定义内容切换效果，是直接切换，还是淡入淡出效果
            "effect":"default",
            //默认展示第几个tab
            "invoke":1,
            //用来定义tab是否自动切换，当指定了时间间隔，就表示自动切换，并且切换时间为指定时间间隔
            "auto":false
        }
        //如果配置参数存在，就扩展掉默认的配置参数
        if(this.getConfig()){
            $.extend(this.config,this.getConfig())
        }
        // console.log(this.config);
        //保存tab标签列表、对应的内容列表
        this.tabItems = this.tab.find("ul.tab-nav li");
        this.contentItems = this.tab.find("div.content-wrap div.content-item");

        //保存配置参数
        var config = this.config;
        if(config.triggerType==='click'){
            this.tabItems.bind(config.triggerType,function(){
                _this_.invoke($(this));
            })
        }else if(config.triggerType==='mouseover' || config.triggerType !='click'){
             this.tabItems.mouseover(function(){
                _this_.invoke($(this));
            })
        }

        //自动切换动能，当配置了时间，我们就根据时间间隔自动切换
        if(config.auto){

            //定义一个全局的定时器
            var timer = null;
            //计数器
            this.loop = 0;
            this.autoPlay();

            this.tab.hover(function(){
                window.clearInterval(_this_.timer);
            },function(){
                _this_.autoPlay();
            });
        };

        //设置默认显示第几个tab
        if(config.invoke>1){
            this.invoke(this.tabItems.eq(config.invoke-1));
        }
    };  

    Tab.prototype = {

        //自动间隔时间切换
        autoPlay : function(){
            var _this_ = this,
            tabItems = this.tabItems,//临时保存tab标签
            tabLength = tabItems.size(),//tab的个数
            config = this.config;

        this.timer = window.setInterval(function(){

            _this_.loop++;

            if(_this_.loop>=tabLength){

                _this_.loop = 0;

            };
            tabItems.eq(_this_.loop).trigger(config.triggerType);
         },config.auto);
        },
        //事件驱动函数
        invoke : function(currentTab){
            var _this_ = this;
            /*
                要执行tab的选中状态，当前选中的加上active(标记白底)
                切换对应的tab内容，要根据配置参数的effect是default还是fade
            */
            var index = currentTab.index();

            //tab选中状态
            currentTab.addClass("actived").siblings().removeClass('actived');

            //切换对应的内容区域
            var effect = this.config.effect;
            var conItems = this.contentItems;
            if(effect==="default" || effect!="fade"){
                conItems.eq(index).addClass("current").siblings().removeClass("current");
            }else if(effect==="fade"){
                conItems.eq(index).fadeIn().siblings().fadeOut();
            };

            //注意:如果配置了自动切换，记得把当前的loop的值设置成当前tab的index
            if(this.config.auto){
                this.loop = index;
            }
        },
        //获取配置参数
        getConfig : function(){
            //拿一下tab elem节点上的data-config
            var config = this.tab.attr('data-config');
            console.log(config);
            if(config&&config!=""){
                console.log($.parseJSON(config))
                return $.parseJSON(config);
                
            }else{
                return null
            }
        }
    };

    Tab.init = function(tabs){
        var _this_ = this;
        tabs.each(function(){
            new _this_($(this));
        })
    }

    //注册成jq方法
    $.fn.extend({
        tab:function(){
            this.each(function(){
                new Tab($(this));
            })
            return this;
        }
    });
    
    window.Tab = Tab;
})(jQuery);