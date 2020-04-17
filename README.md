# Prime Pussify
In the comic [Meow the Infinite](https://meowtheinfinite.com) there is a character called "The Prime Puss" who speaks in an unsettling voice. We wanted the text for the character to be jarring, but we didn't want to restrict font choices to only fonts with built-in jitter. Since Photoshop itself is not able to do basic font operations like random jitter, I cobbled together this script to automate the process of randomly jittering the size and position of the lettering in a Photoshop text layer.

Using the script is simple, if a bit awkward (due to Photoshop's unfortunate limitation on script UI). Simply select a text layer in the layer list, then execute the script. It will prompt you for five numbers that control the jitter: size, size vary, spacing, spacing vary, and baseline vary. The parameters have the following behaviors:

* **Size** is the base size for the font.
* **Size vary** is the amount of variance you want in the size of the font, 0 being no variation at all.
* **Spacing** is the base distance between neighboring characters.
* **Spacing vary** is the amount of variance you want in the spacing, 0 being no variation at all.
* **Baseline vary** is the amount of variance you want between each character and the text baseline, 0 being no variation at all.

The script will remember the settings, so the next time you run it, the input box should automatically contain the previous set of values you enterred.

Ideally, there would be an interface in Photoshop that would just have these values as sliders, and you could play with them until you got the result you wanted. Unfortunately, as far as I was able to determine, Photoshop does not allow scripts to create permanent UI windows in the way that would be necessary for this to work. If anyone has any ideas on how to get around that limitation (without creating a full-blown plugin), please submit a pull request.

Happy drawing,

\- Casey
