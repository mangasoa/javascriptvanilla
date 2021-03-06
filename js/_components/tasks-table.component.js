window.TasksTableComponent = (function (window) {
    'use strict'

    return function (tasks) {
        var self = this;

        self.tasks = tasks;
        self.columns = [
            {
                label: 'Name',
                property: 'TxtCivilName',
                aggregateFn: (item) => {
                    return 1;
                },
                aggregateLabel: 'Number of tasks : ',
            },
            {
                label: 'Number of days',
                property: 'NumDaysRequested',
                defaultValue: '0',
                aggregateFn: (item) => {
                    return item['NumDaysRequested'];
                },
                aggregateLabel: 'Total (in days) : ',
            },
            {
                label: 'Type',
                property: 'TxtType'
            },
            {
                label: 'Date range',
                property: 'TxtDateRange',
            },
            {
                label: 'Company',
                property: 'TxtCompanyName',
            }
        ];

        return {
            render,
            setTasks,
        }

        /**
         * render data
         * @param element
         */
        function render(element) {
            console.log(getTableElement());
            element.innerHTML = '';
            element.append(getTableElement());
        }

        /**
         * Return the html
         * @returns {HTMLTableElement}
         */
        function getTableElement() {
            var tableEl = document.createElement('table');
            tableEl.setAttribute('class', 'Tasks');
            for (var i = 0; i < self.tasks.length; i++) {
                var task = self.tasks[i];
                if (i === 0) {
                    tableEl.append(getHeaderElement(task));
                }
                var line = getLineElement(task);
                tableEl.append(line);
                line.addEventListener('click', function(){
                    //we have to get the name of selected row dynmically, the task variable should alwyas be the same for all the rows 
                    console.log(this)
                   alert(this.firstChild.innerText);
                });
            }
            tableEl.append(getFooterElement(self.aggregatedValues));
            return tableEl;
        }


        /**
         * Return the content of a line in HTML string
         *
         * @returns {HTMLTableSectionElement}
         */
        function getHeaderElement() {
            var columns = [];
            for (var i = 0; i < self.columns.length; i++) {
                var col = self.columns[i];
                columns.push(`<th>${col.label}</th>`);
            }

            var head = document.createElement('thead');
            head.innerHTML = `<tr>${columns.join('')}</tr>`
            return head;
        }

        /**
         * Return the content of a line in HTML string
         *
         * @param task
         * @returns {HTMLTableSectionElement}
         */
        function getLineElement(task) {
            var columns = [];

            for (var i = 0; i < self.columns.length; i++) {
                var col = self.columns[i];
                     columns.push(`<td>${task[col.property] || col.defaultValue || ''}</td>`);
            }

            var tr = document.createElement('tr');
            tr.innerHTML = columns.join('');
            return tr;
        }

        /**
         * Return the content of a footer line in HTML string
         *
         * @param aggregatedLine
         * @returns {HTMLTableSectionElement}
         */
        function getFooterElement(aggregatedLine) {
            var columns = [];
            for (var i = 0; i < self.columns.length; i++) {
                var col = self.columns[i];
                if(aggregatedLine.hasOwnProperty(col.property)){
                    columns.push(`<td>${col.aggregateLabel} ${aggregatedLine[col.property]}</td>`);
                } else {
                    columns.push(`<td></td>`);
                }
            }
            var tfoot = document.createElement('tr');
            tfoot.innerHTML =`<tfoot><tr>${columns.join('')}</tr></tfoot>`;
            return tfoot;
        }

        function setTasks(tasks) {
            //this.task and this.aggregatedValues is used instead of self 
            //"self" should be used because here "this" has a scope which is only within setTasks() function 
            //and we can't acess outsitde of this function
            //  this.tasks = tasks;
            //this.aggregatedValues = getAggregatedValues(tasks);
            self.tasks = tasks;
            self.aggregatedValues = getAggregatedValues(tasks);
        }

        /**
         * Return aggregated values from given tasks data
         *
         * @param tasks
         * @returns {{}}
         */
        function getAggregatedValues(tasks) {
            var aggregatedValues = {};
            for(var i = 0; i < tasks.length; i++) {
                var task = tasks[i];
                for(var j = 0; j < self.columns.length; j++) {
                    var col = self.columns[j];
                    if(col.hasOwnProperty('aggregateFn')){
                        if(!aggregatedValues.hasOwnProperty(col.property)){
                            aggregatedValues[col.property] = 0;
                        }
                        // if number of days is zero, data is returning NaN so we have to set it eqaul to zero
                        if(isNaN(aggregatedValues[col.property])){
                            aggregatedValues[col.property] =0;
                         }
                        aggregatedValues[col.property] += col.aggregateFn(task);
                    }
                }
            }
            return aggregatedValues;
        }
    };

})(window)