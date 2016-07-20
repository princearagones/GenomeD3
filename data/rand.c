#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>

int main(void)
{
    FILE * fp;
    char * line = NULL;
    size_t len = 0;
    ssize_t read;

    srand(time(NULL));
    fp = fopen("real/IRIS_313-15897.TRA", "r");
    if (fp == NULL)
        exit(EXIT_FAILURE);

    while ((read = getline(&line, &len, fp)) != -1) {
    	if(rand()%100 == 0){
    		line = strndup(line, strlen(line)-4);
    		rand()%2 == 0 ? strcat(line,"DUP\n\0") : strcat(line,"TRA\n\0");
    		printf("%s", line);
    	}
    }

    fclose(fp);
    if (line)
        free(line);
    exit(EXIT_SUCCESS);
}