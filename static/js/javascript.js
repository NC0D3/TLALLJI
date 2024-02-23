function matrixiador(str){
            str=str.replaceAll('[','');
            str=str.replaceAll(']','');
            str=str.split(',');
            let str1=[];
            for(let i=0;i<str.length;i=i+3){
                let a=[str[i+0] , str[i+1]  ,str[i+2] ];
                str1.push(a);
            }
            console.log(str1);
            return str1;
        }
        
        function transpose(matrix) {
            const result = matrix[0].map((col, i) => matrix.map((row, j) => row[i]));
            return result;
        }
