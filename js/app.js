var app = angular.module("ToDoApp", ['ngRoute']);

app.config(function($routeProvider) {
        $routeProvider
            .when("/:boardId", {
                templateUrl: 'board.html',
                controller: 'BoardCtrl'
            }).when("/:boardId/:listId", {
                templateUrl: 'list.html',
                controller: 'ListCtrl'
            });
    })
    .controller("myCtrl", function($scope, Data) {

        $scope.mainData = {
            list: Data.getBoards(),
            selectedItem: 0,
            templateBoard: {
                title: 'new board',
                lists: []
            },
            addBoard: function() {
                Data.addBoard(angular.copy($scope.mainData.templateBoard));
            },
            removeBoard: function(_board_ind) {
                Data.removeBoard(_board_ind);
            }

        };


        $scope.selectList = function(_id) {
            $scope.mainData.selectedItem = _id;
        }


    })
    .controller("BoardCtrl", function($routeParams, $scope, Data) {

        var params = $routeParams;

        $scope.boardData = {
            boardId: params.boardId,
            item: Data.getBoardByInd(params.boardId),
            templateList: {
                title: "new list",
                countDone: 0,
                tasks: []
            },
            addList: function() {
                Data.addList(params.boardId, angular.copy($scope.boardData.templateList));
            },
            removeList: function(_list_ind) {
                Data.removeList(params.boardId, _list_ind);
            }
        }

    })
    .controller("ListCtrl", function($routeParams, $scope, Data, $location) {

        var params = $routeParams;

        $scope.listData = {
            list: Data.getListByInd(params.boardId, params.listId),
            templateTask: {
                'title': 'new task',
                'done': false
            },
            addTask: function() {
                Data.addTask(params.boardId, params.listId, angular.copy($scope.listData.templateTask));
            },
            removeTask: function(_task_ind) {
                if ($scope.listData.list.tasks[_task_ind].done == true) {
                    $scope.listData.list.countDone--;
                }
                Data.removeTask(params.boardId, params.listId, _task_ind);
            },
            changeItem: function() {
                var count = 0;
                for (var i = 0; i < $scope.listData.list.tasks.length; i++) {
                    if ($scope.listData.list.tasks[i].done == true) {
                        count++;
                    }
                }
                $scope.listData.list.countDone = count;
            },
            removeList: function() {
                Data.removeList(params.boardId, params.listId);
                $location.path('/' + params.boardId);

            }
        }
    })

.factory('Data', function() {

    var data = {
        boards: [{
            title: 'board 1',
            lists: [{
                    title: "board 1 list 1",
                    countDone: 1,
                    tasks: [
                        { 'title': 'title1', 'done': true },
                        { 'title': 'title2', 'done': false }
                    ]
                }, {
                    title: "board 1 list 2",
                    countDone: 2,
                    tasks: [
                        { 'title': 'title1', 'done': true },
                        { 'title': 'title2', 'done': true }
                    ]
                }

            ]
        }, {
            title: 'board 2',
            lists: [{
                    title: "board 2 list 1",
                    countDone: 1,
                    tasks: [
                        { 'title': 'title1', 'done': true },
                        { 'title': 'title2', 'done': false }
                    ]
                }, {
                    title: "board 2 list 2",
                    countDone: 2,
                    tasks: [
                        { 'title': 'title1', 'done': true },
                        { 'title': 'title2', 'done': true }
                    ]
                }, {
                    title: "board 2 list 2",
                    countDone: 2,
                    tasks: [
                        { 'title': 'title1', 'done': true },
                        { 'title': 'title2', 'done': true }
                    ]
                }

            ]
        }]
    };

    return {
        getBoards: function() {
            return data.boards;
        },
        getBoardByInd: function(_board_ind) {
            return data.boards[_board_ind];
        },
        addBoard: function(_board) {
            data.boards.push(_board);
        },
        removeBoard: function(_board_ind) {
            data.boards.splice(_board_ind, 1);
        },
        getListsOfBoard: function(_board_ind) {
            return data.boards[_board_ind].lists;
        },
        getListByInd: function(_board_ind, _list_ind) {
            return data.boards[_board_ind].lists[_list_ind];
        },
        addList: function(_board_ind, _list) {
            data.boards[_board_ind].lists.push(_list);
        },
        removeList: function(_board_ind, _list_ind) {
            data.boards[_board_ind].lists.splice(_list_ind, 1);
        },
        addTask: function(_board_ind, _list_ind, _task) {
            data.boards[_board_ind].lists[_list_ind].tasks.push(_task);
        },
        removeTask: function(_board_ind, _list_ind, _task_ind) {
            data.boards[_board_ind].lists[_list_ind].tasks.splice(_task_ind, 1);
        }
    };
});
