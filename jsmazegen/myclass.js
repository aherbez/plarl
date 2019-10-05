class MyClass
{

    constructor(name)
    {
        this.name = name || this.name;
        this.greeting = 'Hello, my name is';
    }

    sayHello()
    {
        console.log(`${this.greeting} ${this.name}`);
    }
}

module.exports = {
    MyClass
};
